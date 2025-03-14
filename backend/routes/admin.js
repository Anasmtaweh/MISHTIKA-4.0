const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const adminMiddleware = require('../middleware/adminMiddleware');

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

module.exports = router;
