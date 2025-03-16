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
        <Container className={`${styles.petProfileContainer} mt-5`}> {/* Apply the CSS Module class */}
            <h1 className={styles.petProfileTitle}>Your Pets</h1> {/* Apply the CSS Module class */}
            <ListGroup>
                {pets.map((pet) => (
                    <ListGroup.Item key={pet._id} className={styles.petItem}> {/* Apply the CSS Module class */}
                        <Row className="align-items-center"> {/* Vertically align items */}
                            <Col xs={12} md={3} className="text-center"> {/* Center the image on small screens */}
                                {pet.pictures && pet.pictures.length > 0 && (
                                    <img
                                        src={pet.pictures[0]} // Display the first picture
                                        alt={`${pet.name}`}
                                        className={styles.petImage}
                                    />
                                )}
                            </Col>
                            <Col xs={12} md={6}>
                                <div>
                                    <strong className={styles.petName}>{pet.name}</strong> {/* Apply the CSS Module class */} - {pet.species} ({pet.breed})
                                    <p className={styles.petInfo}>Age: {pet.ageYears} years, {pet.ageMonths} months</p> {/* Apply the CSS Module class */}
                                    <p className={styles.petInfo}>Weight: {pet.weight} kg</p> {/* Apply the CSS Module class */}
                                    {pet.medicalInfo && <p className={styles.petInfo}>Medical Info: {pet.medicalInfo}</p>} {/* Apply the CSS Module class */}
                                </div>
                            </Col>
                            <Col xs={12} md={3} className="text-center"> {/* Center the buttons on small screens */}
                                <Button variant="danger" className={`${styles.deleteButton} mb-2`} onClick={() => handleDelete(pet._id)}> {/* Apply the CSS Module class */}
                                    Delete
                                </Button>
                                <Link to={`/editpet/${pet._id}`}>
                                    <Button variant="primary" className={`${styles.editButton}`}> {/* Apply the CSS Module class */}
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

