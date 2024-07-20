// src/Components/LoginForm.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Import UserContext
import './login.css';
import logo from '../assets/image.png';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext); // Get setUser from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://news-aggregator-login-backend.onrender.com/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser({ username }); // Set the user context
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <br></br><br></br>
      <button type="submit">Login</button>
      <p>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </form>
  );
};

export default LoginForm;
