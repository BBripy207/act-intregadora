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

// Crear tabla de rentas
db.serialize(() => {
    db.run(`
        CREATE TABLE rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            character_id INTEGER NOT NULL,
            duration INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (character_id) REFERENCES characters (id)
        )
    `);
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

// Endpoint para realizar una renta
app.post('/rentals', (req, res) => {
    const { character_id, duration } = req.body;
    const pricePerHour = 200; // Precio fijo por hora
    const price = duration * pricePerHour;

    if (!character_id || !duration) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const stmt = db.prepare('INSERT INTO rentals (character_id, duration, price) VALUES (?, ?, ?)');
    stmt.run(character_id, duration, price, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

// Endpoint para listar las rentas con el nombre del personaje y precio total
app.get('/rentals', (req, res) => {
    const query = `
        SELECT rentals.id, rentals.duration, rentals.price, characters.name AS character_name
        FROM rentals
        JOIN characters ON rentals.character_id = characters.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Calcular el precio total para cada renta
        const rentalsWithTotal = rows.map(rental => ({
            ...rental,
            total_price: rental.price // Asegurarse de usar el campo `price` directamente
        }));
        res.json(rentalsWithTotal);
    });
});

// Endpoint para eliminar una renta
app.delete('/rentals/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM rentals WHERE id = ?');
    stmt.run(id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Renta eliminada con éxito' });
    });
    stmt.finalize();
});

// Crear un servidor HTTP
const server = http.createServer(app);

// Iniciar el servidor HTTP
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
