import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';

function EditPet() {
    const [name, setName] = useState('');
    const [ageYears, setAgeYears] = useState('');
    const [ageMonths, setAgeMonths] = useState('');
    const [weight, setWeight] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [medicalInfo, setMedicalInfo] = useState('');
    const [pictures, setPictures] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { petId } = useParams();

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/pets/${petId}`);
                const petData = response.data;
                setName(petData.name);
                setAgeYears(petData.ageYears);
                setAgeMonths(petData.ageMonths);
                setWeight(petData.weight);
                setSpecies(petData.species);
                setBreed(petData.breed);
                setMedicalInfo(petData.medicalInfo);
                setPictures(petData.pictures || []);
            } catch (error) {
                console.error('Error fetching pet:', error);
                setError('Error fetching pet data');
            }
        };

        fetchPet();
    }, [petId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend validation for ageMonths
        if (ageMonths > 11) {
            setError('Age in months must be 11 or less');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const petData = {
                name,
                ageYears,
                ageMonths,
                weight,
                species,
                breed,
                medicalInfo,
                pictures,
            };

            await axios.put(`http://localhost:3001/pets/${petId}`, petData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Pet updated successfully');
            navigate('/petprofile');
        } catch (err) {
            console.error('Error updating pet:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container className="mt-5">
            <h1>Edit Pet</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Age (Years)</Form.Label>
                    <Form.Control type="number" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} required min="0" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Age (Months)</Form.Label>
                    <Form.Control type="number" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} required min="0" max="11" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required min="0" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Species</Form.Label>
                    <Form.Select value={species} onChange={(e) => setSpecies(e.target.value)} required>
                        <option value="">Select...</option>
                        <option value="Cat">Cat</option>
                        <option value="Dog">Dog</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Breed</Form.Label>
                    <Form.Control type="text" value={breed} onChange={(e) => setBreed(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Medical Information</Form.Label>
                    <Form.Control as="textarea" value={medicalInfo} onChange={(e) => setMedicalInfo(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Pictures (Optional)</Form.Label>
                    <Form.Control type="file" multiple onChange={(e) => setPictures(Array.from(e.target.files))} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}

export default EditPet;
