// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
import Dashboard from './Components/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import { UserProvider } from './context/UserContext'; // Import UserProvider

import './App.css';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route exact path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
