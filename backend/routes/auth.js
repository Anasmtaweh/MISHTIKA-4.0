const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password, username, age } = req.body;

        // Validate input
        if (!email || !password || !username || !age) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ email, password, username, age, role: 'user' });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        console.log("Entered password:", password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret.secret, { expiresIn: '1h' });

        res.json({ token, message: 'Logged in successfully', role: user.role, isActive: user.isActive }); // send back the role
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/user', userMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update user password
router.put('/settings/password', userMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        // Validate the new password (before hashing)
        const isValidNewPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+-])[A-Za-z\d@$!%*?&#+-]{8,}$/.test(newPassword);
        if (!isValidNewPassword) {
            return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }
        // Remove the manual hashing here
        user.password = newPassword; // Just assign the new password
        await user.save(); // Let the pre('save') hook handle the hashing
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/settings/profile', userMiddleware, async (req, res) => {
    try {
        const { username, age } = req.body;
        const userId = req.user.id;

        // Validate age on the backend
        if (age < 13 || age > 120) {
            return res.status(400).json({ message: 'Age must be between 13 and 120' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { username, age } }, // Use $set to update only these fields
            { new: true, runValidators: false } // Return the updated document and disable validators
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
