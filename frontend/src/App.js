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

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${backendUrl}/rentals`, form)
            .then(() => {
                alert('Renta realizada con éxito');
                setForm({ character_id: '', duration: '', price: '' });
                return axios.get(`${backendUrl}/rentals`);
            })
            .then(response => setRentals(response.data))
            .catch(error => console.error('Error creating rental:', error));
    };

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

            <h2>Realizar una Renta</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Personaje:
                    <select name="character_id" value={form.character_id} onChange={handleInputChange}>
                        <option value="">Seleccionar</option>
                        {characters.map(character => (
                            <option key={character.id} value={character.id}>
                                {character.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Duración (horas):
                    <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Precio:
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br />
                <button type="submit">Rentar</button>
            </form>

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
