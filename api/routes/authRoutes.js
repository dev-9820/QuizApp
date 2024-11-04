// server/routes/authRoutes.js
const express = require('express');
const { signup, login, submitScore, getProfile, verifyOtp } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/score', verifyToken, submitScore);
router.get('/profile', verifyToken, getProfile);


module.exports = router;
