// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');





// Modified signup function
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = new User({ username, email, password, role});
    await user.save();

    res.status(201).json({ message: 'User created.' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};




exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'scores.quizId',
      select: 'title' // Only include the title field of the quiz
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Map over the scores to send quiz titles instead of quiz IDs
    const formattedScores = user.scores.map(score => ({
      quizTitle: score.quizId.title, // Assumes `quizId` is populated with the title
      score: score.score
    }));

    res.json({
      username: user.username,
      scores: formattedScores
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

exports.submitScore = async (req, res) => {
  const { quizId, score } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.scores.push({ quizId, score });
    await user.save();

    res.json({ message: 'Score submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting score', error });
  }
};


// Login function
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
