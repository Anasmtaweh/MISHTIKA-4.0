import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import styles from './PetProfile.module.css'; // Import the CSS Module

function PetProfile() {
    useEffect(() => {
        document.title = "MISHTIKA - Pet Profile";
    }, []);
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
        <Container className={`${styles.petProfileContainer} mt-5`}>
            <h1 className={styles.petProfileTitle}>Your Pets</h1>
            <ListGroup>
                {pets.map((pet) => (
                    <ListGroup.Item key={pet._id} className={styles.petItem}>
                        <Row className="align-items-center">
                            <Col xs={12} md={4} className="text-center">
                                {pet.pictures && pet.pictures.length > 0 && (
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={pet.pictures[0]}
                                            alt={`${pet.name}`}
                                            className={styles.petImage}
                                        />
                                    </div>
                                )}
                            </Col>
                            <Col xs={12} md={5}>
                                <div className={styles.petInfoContainer}>
                                    <strong className={styles.petName}>{pet.name}</strong> - {pet.species} ({pet.breed})
                                    <p className={styles.petInfo}>Age: {pet.ageYears} years, {pet.ageMonths} months</p>
                                    <p className={styles.petInfo}>Weight: {pet.weight} kg</p>
                                    {pet.medicalInfo && <p className={styles.petInfo}>Medical Info: {pet.medicalInfo}</p>}
                                </div>
                            </Col>
                            <Col xs={12} md={3} className="d-flex flex-column justify-content-center align-items-center">
                                <Button variant="danger" className={`${styles.deleteButton} mb-2`} onClick={() => handleDelete(pet._id)}>
                                    Delete
                                </Button>
                                <Link to={`/editpet/${pet._id}`} className="w-100">
                                    <Button variant="primary" className={`${styles.editButton} w-100`}>
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
