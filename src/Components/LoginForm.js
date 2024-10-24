import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { ThreeDots } from 'react-loader-spinner'; // Import the ThreeDots component
import './login.css';
import logo from '../assets/image.png';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
    try {
      const response = await axios.post('https://news-aggregator-login-backend.onrender.com/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser({ username });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when login completes
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
      <br /><br />
      <button type="submit" className='loginbtn' disabled={loading}>Login</button>
      {loading && (
        <div className="loader-container">
          <ThreeDots
            height="70"
            width="70"
            radius="9"
            color="#007bff"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}
      <p className='neww'>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
      <p className="info">Please do not refresh the page after logging in</p>
        
      <p className="language-info">
   Note: The language-changing functionality is currently not working but will be fixed soon.
  </p>
    </form>
  );
};

export default LoginForm;
