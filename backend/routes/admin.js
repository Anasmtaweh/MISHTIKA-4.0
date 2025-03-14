const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const adminMiddleware = require('../middleware/adminMiddleware');
const bcrypt = require('bcrypt');

router.get('/dashboard', adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPets = await Pet.countDocuments();
        // For the moment we will simulate the users active
        const activeUsers = 10;

        const recentActivity = [
            // For now, we'll return static data. Later, we'll query the database.
            { type: 'user_signup', timestamp: new Date(), details: 'New user signed up' },
            { type: 'pet_added', timestamp: new Date(), details: 'New pet added' },
        ];

        res.json({
            totalUsers,
            totalPets,
            activeUsers,
            recentActivity,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get all users
router.get('/users', adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete user
router.delete('/users/:id', adminMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update user status
router.put('/users/:id', adminMiddleware, async (req, res) => {
    try {
        const { isActive } = req.body;
        await User.findByIdAndUpdate(req.params.id, { isActive });
        res.json({ message: 'User status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get all pets with owner names
router.get('/pets', adminMiddleware, async (req, res) => {
    try {
        const pets = await Pet.find().populate('owner', 'email'); // Populate the 'owner' field with 'email'
        // create the petWithOwner
        const petsWithOwnerNames = pets.map(pet => ({
            ...pet.toObject(), // Convert mongoose doc to plain object
            ownerName: pet.owner.email
        }));
        res.json(petsWithOwnerNames); // Send the pet list
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete Pet
router.delete('/pets/:id', adminMiddleware, async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pet deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update admin password
router.put('/settings/password', adminMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id); // req.user is set by adminMiddleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Check if the new password is the same as the current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password' });
        }

        // Validate the new password
        const isValidNewPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword);
        if (!isValidNewPassword) {
            return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update admin profile
router.put('/settings/profile', adminMiddleware, async (req, res) => {
    try {
        const { username, age } = req.body;
        const user = await User.findById(req.user.id); // req.user is set by adminMiddleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        user.age = age;
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
