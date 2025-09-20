const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('Error: JWT_SECRET is not defined in the .env file.');
    process.exit(1);
}

const authenticate = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};

module.exports = { authenticate };