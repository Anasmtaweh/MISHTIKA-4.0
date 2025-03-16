import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditPet.module.css'; // Import the CSS Module

function EditPet() {
    useEffect(() => {
        document.title = "MISHTIKA - Edit Pet";
    }, []);
    const [name, setName] = useState('');
    const [ageYears, setAgeYears] = useState('');
    const [ageMonths, setAgeMonths] = useState('');
    const [weight, setWeight] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [medicalInfo, setMedicalInfo] = useState('');
    const [pictures, setPictures] = useState([]);
    const [error, setError] = useState('');
    const [isOtherBreed, setIsOtherBreed] = useState(false); // New state variable
    const navigate = useNavigate();
    const { petId } = useParams();

    // List of dog breeds
    const dogBreeds = [
        "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
        "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund",
        "Boxer", "Siberian Husky", "Shih Tzu", "Great Dane", "Doberman Pinscher",
        "Australian Shepherd", "Cavalier King Charles Spaniel", "Pembroke Welsh Corgi",
        "Chihuahua", "Bernese Mountain Dog"
    ];

    // List of cat breeds
    const catBreeds = [
        "Persian", "Maine Coon", "Ragdoll", "Siamese", "British Shorthair",
        "Bengal", "Sphynx", "Abyssinian", "Scottish Fold", "Russian Blue",
        "American Shorthair", "Norwegian Forest Cat", "Devon Rex", "Birman",
        "Oriental Shorthair", "Exotic Shorthair", "Tonkinese", "Burmese",
        "Siberian", "Cornish Rex"
    ];

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
                setIsOtherBreed(petData.breed === 'other');
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
        // Check if breed is empty when not manually entered
        if (species === 'Dog' && !isOtherBreed && breed === '') {
            setError('Please select a breed.');
            return;
        }
        if (species === 'Cat' && !isOtherBreed && breed === '') {
            setError('Please select a breed.');
            return;
        }
        if (species !== 'Dog' && species !== 'Cat' && breed === '') {
            setError('Please enter a breed.');
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
    const handleBreedChange = (e) => {
        setBreed(e.target.value);
        setIsOtherBreed(e.target.value === 'other'); // Update isOtherBreed
    };

    return (
        <Container className={`${styles.editPetContainer} mt-5`}> {/* Apply the CSS Module class */}
            <h1 className={styles.editPetTitle}>Edit Pet</h1> {/* Apply the CSS Module class */}
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Name</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Control className={styles.formControl} type="text" value={name} onChange={(e) => setName(e.target.value)} required /> {/* Apply the CSS Module class */}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Age (Years)</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Control className={styles.formControl} type="number" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} required min="0" /> {/* Apply the CSS Module class */}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Age (Months)</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Control className={styles.formControl} type="number" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} required min="0" max="11" /> {/* Apply the CSS Module class */}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Weight (kg)</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Control className={styles.formControl} type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required min="0" /> {/* Apply the CSS Module class */}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Species</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Select className={styles.formControl} value={species} onChange={(e) => setSpecies(e.target.value)} required> {/* Apply the CSS Module class */}
                        <option value="">Select...</option>
                        <option value="Cat">Cat</option>
                        <option value="Dog">Dog</option>
                    </Form.Select>
                </Form.Group>
                {/* Conditionally render breed selection for dogs */}
                {species === 'Dog' && (
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.formLabel}>Breed</Form.Label> {/* Apply the CSS Module class */}
                        <Form.Select className={styles.formControl} value={breed} onChange={handleBreedChange} required={!isOtherBreed}> {/* Apply the CSS Module class */}
                            <option value="">Select...</option>
                            {dogBreeds.map((breedName) => (
                                <option key={breedName} value={breedName}>{breedName}</option>
                            ))}
                            <option value="other">Other (Please Specify)</option>
                        </Form.Select>
                    </Form.Group>
                )}
                {/* Conditionally render breed selection for cats */}
                {species === 'Cat' && (
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.formLabel}>Breed</Form.Label> {/* Apply the CSS Module class */}
                        <Form.Select className={styles.formControl} value={breed} onChange={handleBreedChange} required={!isOtherBreed}> {/* Apply the CSS Module class */}
                            <option value="">Select...</option>
                            {catBreeds.map((breedName) => (
                                <option key={breedName} value={breedName}>{breedName}</option>
                            ))}
                            <option value="other">Other (Please Specify)</option>
                        </Form.Select>
                    </Form.Group>
                )}
                {/* Conditionally render manual breed input */}
                {(species === 'Dog' || species === 'Cat') && isOtherBreed && (
                    <Form.Group className="mb-3">
                        <Form.Control className={styles.formControl} type="text" placeholder="Enter Breed" value={breed} onChange={(e) => setBreed(e.target.value)} required /> {/* Apply the CSS Module class */}
                    </Form.Group>
                )}
                {species !== 'Dog' && species !== 'Cat' && (
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.formLabel}>Breed</Form.Label> {/* Apply the CSS Module class */}
                        <Form.Control className={styles.formControl} type="text" value={breed} onChange={(e) => setBreed(e.target.value)} required /> {/* Apply the CSS Module class */}
                    </Form.Group>
                )}
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Medical Information</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Control className={styles.formControl} as="textarea" value={medicalInfo} onChange={(e) => setMedicalInfo(e.target.value)} /> {/* Apply the CSS Module class */}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>Pictures (Optional)</Form.Label> {/* Apply the CSS Module class */}
                    <Form.Control className={styles.formControl} type="file" multiple onChange={(e) => setPictures(Array.from(e.target.files))} /> {/* Apply the CSS Module class */}
                </Form.Group>
                <Button className={styles.editPetButton} variant="primary" type="submit"> {/* Apply the CSS Module class */}
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}

export default EditPet;
