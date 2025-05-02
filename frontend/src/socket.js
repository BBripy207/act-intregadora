import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        // Cambiar localhost por el nombre del servicio del backend
        axios.get('http://backend:3000/characters')
            .then(response => setCharacters(response.data))
            .catch(error => console.error('Error fetching characters:', error));
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Personajes de Star Wars</h1>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map(character => (
                        <tr key={character.id}>
                            <td>{character.id}</td>
                            <td>{character.name}</td>
                            <td>{character.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Deshabilitar la inicialización del WebSocket
// const socket = new WebSocket('ws://localhost:3000/ws');
// export default socket;

export default App;