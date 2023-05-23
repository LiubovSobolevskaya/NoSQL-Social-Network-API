const router = require('express').Router();

// Import routes for thoughts and users
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

// Route handling for '/thoughts'
router.use('/thoughts', thoughtRoutes);

// Route handling for '/users'
router.use('/users', userRoutes);

module.exports = router;
