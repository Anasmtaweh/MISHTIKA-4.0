const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');
const User = require('../models/User'); // Import the User model

const adminMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret.secret);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required' });
        }

        // Check if the user is active
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(403).json({ message: 'Access denied. User is inactive' });
        }

        req.user = decoded; // Set the decoded token as req.user
        req.user.id = decoded.id; // Set the user id
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = adminMiddleware;
