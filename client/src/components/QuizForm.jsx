// client/src/components/QuizForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { IoIosArrowRoundBack } from "react-icons/io";
import AdminNavbar from '../components/AdminNavbar';

const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index][e.target.name] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (index, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[index].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/quizzes', {
        title,
        timeLimit,
        questions,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-200 to-purple-200 p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 shadow-lg rounded-lg space-y-6">
          <a href="/admin/dashboard"><div className="absolute translate-y-5 hover:scale-125 transition-all duration-300 cursor-pointer translate-x-4"><IoIosArrowRoundBack size={40} /></div></a>
          <h2 className="text-3xl font-bold text-center text-gray-800">Create a New Quiz</h2>

          <div className="space-y-2">
            <label className="block text-gray-600">Quiz Title</label>
            <input
              type="text"
              placeholder="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600">Time Limit for Quiz (seconds)</label>
            <input
              type="number"
              placeholder="Enter total time limit for the quiz"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-500"
            />
          </div>

          {questions.map((q, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
              <div>
                <label className="block text-gray-600">Question {index + 1}</label>
                <input
                  type="text"
                  name="question"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <label className="block text-gray-600">Option {optionIndex + 1}</label>
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e)}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-gray-600">Select Correct Answer</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].correctAnswer = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="" disabled>Select Correct Answer</option>
                  {q.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none transition duration-200"
            >
              <FaPlus className="mr-2" /> Add Question
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none transition duration-200"
            >
              <FaCheck className="mr-2" /> Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
