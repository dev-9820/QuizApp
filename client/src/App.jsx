// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QuizForm from "./components/QuizForm"; // Import QuizForm
import QuizAttempt from "./pages/QuizAttempt"; // Import QuizAttempt
import './index.css'
import './App.css'
import UserProfile from "./pages/UserProfile";
import EditQuiz from './pages/EditQuiz'
import Leaderboard from './pages/Leaderboard'

const App = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
       
        <Route path="/admin/create-quiz" element={<QuizForm />} /> {/* Route for creating a quiz */}
        <Route path="/quiz/:id" element={<QuizAttempt />} />
        <Route path="/admin/edit-quiz/:id" element={<EditQuiz />} /> {/* Edit Quiz page */}

      </Routes>
    </Router>
  );
};

export default App;
