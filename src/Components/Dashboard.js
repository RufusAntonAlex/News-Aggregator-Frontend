// src/Components/Dashboard.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import UserContext
import './Dashboard.css';
import settings from '../assets/settings.png';
import LoginForm from './LoginForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get user from context
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const fetchNews = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`https://news-aggregator-backend-h2br.onrender.com/top-headlines?category=${category}&language=en&page=1&pageSize=80`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news - ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.data.status === 'ok') {
        setArticles(data.data.articles);
      } else {
        throw new Error('Failed to fetch news - Invalid response');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsDarkMode(false);
    document.body.classList.remove('dark-mode');
    navigate('/');
  };

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <nav className="navbar">
        <div className="navbar-left">NewsFeed</div>
        <div className="navbar-right">
          <i className="fa-solid fa-bars menu-icon" onClick={openMenu}></i>
          <div ref={menuRef} className={`menu-options ${isMenuOpen ? 'open' : ''}`}>
            <i className="fa-solid fa-xmark" onClick={closeMenu}></i>
            <div className="nav-option">
              <select
                value={selectedCategory}
                onChange={(e) => handleChangeCategory(e.target.value)}
                className="nav-select"
              >
                <option value="General">General</option>
                <option value="Business">Business</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="nav-option hell">
              <i className="fa-regular fa-sun"></i>&nbsp;&nbsp;&nbsp;
              <label className="switch">
                <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                <span className="slider round"></span>
              </label>&nbsp;&nbsp;&nbsp;
              <i className="fa-regular fa-moon"></i>
            </div>
            <div className="nav-option logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </nav>

      <div className="content">
      <h3 className='welcome-message'>Welcome, {user.username}</h3> 
        <h2 className='top-head'>Top Headlines ({selectedCategory})</h2>
        
        {loading ? (
          <div className="loading">
            <img src={settings} alt="Loading" className="loading-image" />
          </div>
        ) : (
          <div className="articles">
            {articles
              .filter(article => article.title !== '[Removed]' && article.urlToImage)
              .map((article, index) => (
                <div key={index} className="article">
                  <img src={article.urlToImage} alt={article.title} className="article-image" />
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <p>{article.publishedAt}</p>
                  <p>{article.content}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
