const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId).populate({
        path: 'scores.quizId',
        select: 'title' // Only include the title field of the quiz
      });
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json({
        username: user.username,
        scores: user.scores.map(score => ({
          quizTitle: score.quizId.title, // Assuming scores store references to Quiz model
          score: score.score
        }))
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error });
    }
  };