import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Determinar la URL base del backend
const backendUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : process.env.REACT_APP_BACKEND_URL || 'http://backend:3000';

function App() {
    const [characters, setCharacters] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [duration, setDuration] = useState('');

    useEffect(() => {
        axios.get(`${backendUrl}/characters`)
            .then(response => setCharacters(response.data))
            .catch(error => console.error('Error fetching characters:', error));

        axios.get(`${backendUrl}/rentals`)
            .then(response => setRentals(response.data))
            .catch(error => console.error('Error fetching rentals:', error));
    }, []);

    const handleRent = () => {
        if (!duration || isNaN(duration) || duration <= 0) {
            alert('Debe ingresar una duración válida.');
            return;
        }

        axios.post(`${backendUrl}/rentals`, { character_id: selectedCharacter.id, duration })
            .then(() => {
                alert('Renta realizada con éxito');
                setDuration('');
                setSelectedCharacter(null);
                return axios.get(`${backendUrl}/rentals`);
            })
            .then(response => setRentals(response.data))
            .catch(error => console.error('Error creating rental:', error));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Personajes de Star Wars</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {characters.map(character => (
                    <div
                        key={character.id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '20px',
                            width: '200px',
                            textAlign: 'center',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <h2>{character.name}</h2>
                        <p>{character.description}</p>
                        <p><strong>Precio por hora:</strong> $200</p>
                        <button
                            onClick={() => setSelectedCharacter(character)}
                            style={{
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Ver Detalles
                        </button>
                    </div>
                ))}
            </div>

            {selectedCharacter && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            width: '400px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <h2>{selectedCharacter.name}</h2>
                        <p>{selectedCharacter.description}</p>
                        <p><strong>Precio por hora:</strong> $200</p>
                        <label>
                            Duración (horas):
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                style={{ width: '100%', margin: '10px 0', padding: '8px' }}
                            />
                        </label>
                        <button
                            onClick={handleRent}
                            style={{
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            Rentar
                        </button>
                        <button
                            onClick={() => setSelectedCharacter(null)}
                            style={{
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            <h2>Rentas Realizadas</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Personaje</th>
                        <th>Duración (horas)</th>
                        <th>Precio Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map(rental => (
                        <tr key={rental.id}>
                            <td>{rental.id}</td>
                            <td>{rental.character_name}</td>
                            <td>{rental.duration}</td>
                            <td>${rental.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
