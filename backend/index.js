const express = require('express');
const cors = require('cors'); // Importar el paquete cors
const sqlite3 = require('sqlite3').verbose();
const http = require('http');

const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors());

// Base de datos SQLite en memoria
const db = new sqlite3.Database(':memory:');

// Middleware para parsear JSON
app.use(express.json());

// Crear tabla de personajes
db.serialize(() => {
    db.run(`
    CREATE TABLE characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

    const characters = [
        { name: 'Obi-Wan Kenobi', description: 'Maestro Jedi' },
        { name: 'Anakin Skywalker', description: 'El elegido' },
        { name: 'Luke Skywalker', description: 'Héroe de la Rebelión' },
        { name: 'Leia Organa', description: 'Princesa de Alderaan' },
        { name: 'Padmé Amidala', description: 'Senadora de Naboo' },
        { name: 'Yoda', description: 'Gran Maestro Jedi' },
        { name: 'Mace Windu', description: 'Maestro Jedi' },
        { name: 'Darth Revan', description: 'Sith legendario' },
        { name: 'Starkiller', description: 'Aprendiz de Darth Vader' }
    ];

    const stmt = db.prepare('INSERT INTO characters (name, description) VALUES (?, ?)');
    characters.forEach(char => stmt.run(char.name, char.description));
    stmt.finalize();
});

// Endpoint para obtener todos los personajes
app.get('/characters', (req, res) => {
    db.all('SELECT * FROM characters', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Datos enviados al frontend:', rows); // Agregar este log
        res.json(rows);
    });
});

// Endpoint para obtener un personaje por ID
app.get('/characters/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Character not found' });
            return;
        }
        res.json(row);
    });
});

// Crear un servidor HTTP
const server = http.createServer(app);

// Iniciar el servidor HTTP
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
