// server/controllers/quizController.js
const Quiz = require('../models/Quiz');
const User = require('../models/User');




// Create a new quiz
exports.createQuiz = async (req, res) => {
  const { title, questions, timeLimit } = req.body;
  try {
    const quiz = new Quiz({ title, questions, timeLimit, createdBy: req.userId });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz', error });
  }
};

exports.getLeaderboard = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch users who have scores for the given quiz
    const users = await User.find({ 'scores.quizId': id }).select('username scores');
    
    // Filter and sort scores for the specific quiz
    const leaderboard = users
      .map(user => {
        const scoreEntry = user.scores.find(score => score.quizId.toString() === id);
        return {
          username: user.username,
          score: scoreEntry.score, // Default to 0 if no score found
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 10); // Limit to top 10 scores
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you're getting the user ID from the token
    const quizzes = await Quiz.find();

    // Fetch user scores
    const user = await User.findById(userId).select('scores');

    // Map quizzes to include whether the user has already attempted each one
    const quizzesWithStatus = quizzes.map(quiz => {
      const hasAttempted = user.scores.some(score => score.quizId.toString() === quiz._id.toString());
      return {
        ...quiz.toObject(), // Convert Mongoose document to plain object
        hasAttempted,
      };
    });

    res.json(quizzesWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, questions, timeLimit } = req.body;
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, { title, questions, timeLimit }, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: 'Error updating quiz', error });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error });
  }
};
