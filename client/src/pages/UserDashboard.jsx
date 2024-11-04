// client/src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const attemptQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-8">Available Quizzes</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                <p className="text-gray-500 mt-2">Test your knowledge with this quiz!</p>
                <button
                  onClick={() => attemptQuiz(quiz._id)}
                  disabled={quiz.hasAttempted} // Disable if already attempted
                  className={`mt-4 px-4 py-2 ${quiz.hasAttempted ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition duration-200`}
                >
                  {quiz.hasAttempted ? 'Already Attempted' : 'Attempt Quiz'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
