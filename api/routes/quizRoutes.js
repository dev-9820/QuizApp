// server/routes/quizRoutes.js
const express = require('express');
const { createQuiz, getQuizzes, getQuizById, updateQuiz, deleteQuiz, getLeaderboard, submitQuiz } = require('../controllers/quizController');
const { verifyToken } = require('../middleware/authMiddleware'); // Middleware to verify JWT
const router = express.Router();

// Middleware to protect routes
router.use(verifyToken);

router.post('/', createQuiz);         // Admin creates a quiz
router.get('/', getQuizzes);           // Get all quizzes
router.get('/:id', getQuizById);       // Get quiz by ID
router.put('/:id', updateQuiz);        // Update quiz
router.delete('/:id', deleteQuiz);     // Delete quiz

router.get('/submit', submitQuiz)


router.get('/:id/leaderboard', getLeaderboard);


module.exports = router;
