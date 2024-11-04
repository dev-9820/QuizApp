// client/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaTrash } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
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

  const createQuiz = () => {
    navigate('/admin/create-quiz');
  };

  const deleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Update the quizzes state to remove the deleted quiz
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz. Please try again.');
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex flex-col items-center p-8 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-lg p-8">
          <header className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={createQuiz}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2" /> Add New Quiz
            </button>
          </header>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105 relative"
                >
                  <h3 className="text-2xl font-semibold text-blue-700 mb-3">{quiz.title}</h3>
                  <p className="text-gray-700 mb-3">Questions: {quiz.questions.length}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/admin/edit-quiz/${quiz._id}`)}
                      className="text-sm bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                    >
                      Edit Quiz
                    </button>
                    <button
                      onClick={() => deleteQuiz(quiz._id)}
                      className="text-sm bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-700 mt-10">
              <FaClipboardList size={50} className="mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium">No quizzes available. Start by creating one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
