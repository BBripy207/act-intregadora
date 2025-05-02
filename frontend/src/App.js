import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Determinar la URL base del backend
const backendUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : process.env.REACT_APP_BACKEND_URL || 'http://backend:3000';

function App() {
    const [characters, setCharacters] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [form, setForm] = useState({ character_id: '', duration: '', price: '' });

    useEffect(() => {
        axios.get(`${backendUrl}/characters`)
            .then(response => setCharacters(response.data))
            .catch(error => console.error('Error fetching characters:', error));

        axios.get(`${backendUrl}/rentals`)
            .then(response => setRentals(response.data))
            .catch(error => console.error('Error fetching rentals:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleRent = (characterId) => {
        const duration = prompt('Ingrese la duración de la renta (en horas):');
        const price = prompt('Ingrese el precio de la renta:');
        if (!duration || !price) {
            alert('Debe ingresar duración y precio para realizar la renta.');
            return;
        }

        axios.post(`${backendUrl}/rentals`, { character_id: characterId, duration, price })
            .then(() => {
                alert('Renta realizada con éxito');
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
                        <button
                            onClick={() => handleRent(character.id)}
                            style={{
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Rentar
                        </button>
                    </div>
                ))}
            </div>

            <h2>Rentas Realizadas</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Personaje</th>
                        <th>Duración</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map(rental => (
                        <tr key={rental.id}>
                            <td>{rental.id}</td>
                            <td>{rental.character_id}</td>
                            <td>{rental.duration}</td>
                            <td>{rental.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
