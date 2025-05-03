import React, { useEffect, useState } from 'react';
import axios from 'axios';
import images from './images'; // Importar el mapa de imágenes

// Determinar la URL base del backend
const backendUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : process.env.REACT_APP_BACKEND_URL || 'http://backend:3000';

function App() {
    const [characters, setCharacters] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [duration, setDuration] = useState('');
    const [activeTab, setActiveTab] = useState('characters'); // Pestaña activa

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

    const handleCancelRental = (rentalId) => {
        axios.delete(`${backendUrl}/rentals/${rentalId}`)
            .then(() => {
                alert('Renta cancelada con éxito');
                return axios.get(`${backendUrl}/rentals`);
            })
            .then(response => setRentals(response.data))
            .catch(error => console.error('Error canceling rental:', error));
    };

    return (
        <div
            style={{
                padding: '20px',
                fontFamily: 'Star Jedi, Arial, sans-serif',
                backgroundImage: `url(${images.fondo})`, // Usar la imagen de fondo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#FFE81F',
                minHeight: '100vh'
            }}
        >
            <h1 style={{ textAlign: 'center', fontSize: '3rem', textShadow: '0 0 10px #FFE81F' }}>Star Wars App</h1>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setActiveTab('characters')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        backgroundColor: activeTab === 'characters' ? '#FFE81F' : '#444',
                        color: activeTab === 'characters' ? '#000' : '#FFE81F',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 10px #FFE81F'
                    }}
                >
                    Personajes
                </button>
                <button
                    onClick={() => setActiveTab('rentals')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'rentals' ? '#FFE81F' : '#444',
                        color: activeTab === 'rentals' ? '#000' : '#FFE81F',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 10px #FFE81F'
                    }}
                >
                    Rentas Realizadas
                </button>
            </div>

            {activeTab === 'characters' && (
                <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        {characters.map(character => (
                            <div
                                key={character.id}
                                style={{
                                    border: '1px solid #FFE81F',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    width: '250px', // Tamaño uniforme para las tarjetas
                                    height: '400px', // Altura uniforme para las tarjetas
                                    textAlign: 'center',
                                    boxShadow: '0 0 10px #FFE81F',
                                    backgroundColor: '#111',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <img
                                    src={images[character.name]}
                                    alt={character.name}
                                    style={{
                                        width: '100%',
                                        height: '200px', // Tamaño uniforme para las imágenes
                                        objectFit: 'cover', // Ajustar la imagen sin deformarla
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}
                                />
                                <h2 style={{ color: '#FFE81F', fontSize: '1.5rem' }}>{character.name}</h2>
                                <p style={{ color: '#FFF', flexGrow: 1 }}>{character.description}</p>
                                <p><strong>Precio por hora:</strong> $200</p>
                                <button
                                    onClick={() => setSelectedCharacter(character)}
                                    style={{
                                        backgroundColor: '#FFE81F',
                                        color: '#000',
                                        border: 'none',
                                        padding: '10px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 0 10px #FFE81F'
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
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#111',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    width: '400px',
                                    maxHeight: '90vh', // Limitar la altura máxima del modal
                                    overflowY: 'auto', // Habilitar scroll si el contenido excede la altura
                                    boxShadow: '0 0 20px #FFE81F',
                                    color: '#FFE81F',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            >
                                <img
                                    src={images[selectedCharacter.name]}
                                    alt={selectedCharacter.name}
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px', // Limitar la altura máxima de la imagen
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}
                                />
                                <h2>{selectedCharacter.name}</h2>
                                <p>{selectedCharacter.description}</p>
                                <p><strong>Precio por hora:</strong> $200</p>
                                <label>
                                    Duración (horas):
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        min="0"
                                        style={{
                                            width: '100%',
                                            margin: '10px 0',
                                            padding: '8px',
                                            backgroundColor: '#222',
                                            color: '#FFE81F',
                                            border: '1px solid #FFE81F'
                                        }}
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
                                        marginRight: '10px',
                                        textTransform: 'uppercase'
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
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'rentals' && (
                <div>
                    <h2 style={{ textAlign: 'center', textShadow: '0 0 10px #FFE81F' }}>Rentas Realizadas</h2>
                    <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', backgroundColor: '#111', color: '#FFE81F', border: '1px solid #FFE81F' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Personaje</th>
                                <th>Duración (horas)</th>
                                <th>Precio Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(rental => (
                                <tr key={rental.id}>
                                    <td>{rental.id}</td>
                                    <td>{rental.character_name}</td>
                                    <td>{rental.duration}</td>
                                    <td>${rental.price}</td>
                                    <td>
                                        <button
                                            onClick={() => handleCancelRental(rental.id)}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
