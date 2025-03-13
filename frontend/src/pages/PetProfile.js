import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

function PetProfile() {
    const [pets, setPets] = useState([]);
    const token = localStorage.getItem('token');

    const handleDelete = async (petId) => {
        try {
            await axios.delete(`http://localhost:3001/pets/${petId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refresh the pet list after deletion
            setPets(pets.filter((pet) => pet._id !== petId));
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    useEffect(() => {
        const fetchPets = async () => {
            try {
                if (token) {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const ownerId = decodedToken.id;
                    const response = await axios.get(`http://localhost:3001/pets/owner/${ownerId}`);
                    setPets(response.data);
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };

        fetchPets();
    }, [token]);

    return (
        <Container className="mt-5">
            <h1>Your Pets</h1>
            <ListGroup>
                {pets.map((pet) => (
                    <ListGroup.Item key={pet._id}>
                        <Row>
                            <Col>
                                <div>
                                    <strong>{pet.name}</strong> - {pet.species} ({pet.breed})
                                    <p>Age: {pet.ageYears} years, {pet.ageMonths} months</p>
                                    <p>Weight: {pet.weight} kg</p>
                                    {pet.medicalInfo && <p>Medical Info: {pet.medicalInfo}</p>}
                                </div>
                            </Col>
                            <Col xs="auto">
                                <Button variant="danger" onClick={() => handleDelete(pet._id)}>
                                    Delete
                                </Button>
                                <Link to={`/editpet/${pet._id}`}>
                                    <Button variant="primary" className="ms-2">
                                        Edit
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default PetProfile;
