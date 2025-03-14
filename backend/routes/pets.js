const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User'); // Import the User model

// Add Pet
router.post('/add', async (req, res) => {
    try {
        const { name, ageYears, ageMonths, weight, species, breed, medicalInfo, owner, pictures } = req.body; //pictures are optional.

        // Validate input
        if (!name || !ageYears || !ageMonths || !weight || !species || !breed || !owner) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (ageMonths > 11) {
            return res.status(400).json({ message: 'Age in months must be 11 or less' });
        }

        // Create a new pet (pictures are optional)
        const newPet = new Pet({ name, ageYears, ageMonths, weight, species, breed, medicalInfo, owner, pictures });
        await newPet.save();
        res.status(201).json(newPet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all pets for a user
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.params.ownerId });
        // Fetch owner names for each pet
        const petsWithOwnerNames = await Promise.all(pets.map(async (pet) => {
            const owner = await User.findById(pet.owner);
            return { ...pet._doc, ownerName: owner ? owner.username : 'Unknown' }; // add owner name to the pet
        }));
        res.json(petsWithOwnerNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete Pet
router.delete('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json({ message: 'Pet deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get Pet by ID
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update Pet
router.put('/:id', async (req, res) => {
    try {
        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(updatedPet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
