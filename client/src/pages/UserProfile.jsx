import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaTrophy } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className='bg-gradient-to-r justify-center font-mono align-middle text-center self-center center text-4xl from-indigo-300 to-violet-300 h-screen p-64'><div>404 ERROR <a href='/login' className="text-gray-500 cursor-pointer hover:text-gray-800 transition-all duration-200"> LOGIN </a> FIRST </div></div>;

  const quizTitles = profile.scores.map(score => score.quizTitle);
  const quizScores = profile.scores.map(score => score.score);

  const chartData = {
    labels: quizTitles,
    datasets: [
      {
        label: 'Quiz Scores',
        data: quizScores,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Quiz Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex items-center mb-6">
          <FaUserCircle size={50} className="text-blue-500" />
          <h1 className="text-3xl font-bold ml-4">{profile.username}</h1>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-inner mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mt-4 mb-3 flex items-center">
            <FaTrophy className="mr-2" /> Quiz Scores
          </h2>
          {profile.scores.length > 0 ? (
            <ul className="space-y-2 mb-6">
              {profile.scores.map((score, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-md border border-blue-200"
                >
                  <div>
                    <span className="font-medium text-gray-700">Quiz Title:</span> {score.quizTitle}
                  </div>
                  <div className="text-blue-500 font-bold text-lg">
                    <span className="mr-1">Score:</span> {score.score}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic mt-2">No scores available.</p>
          )}
        </div>

        {/* Chart Section */}
        {profile.scores.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Performance Chart</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
