import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import settings from '../assets/settings.png';
import LoginForm from './LoginForm';
import { UserContext } from '../context/UserContext';

const languages = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  or: "Odia",
  pa: "Punjabi",
  ur: "Urdu",
  as: "Assamese",
  si: "Sinhala",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  ru: "Russian",
  pl: "Polish",
  tr: "Turkish",
  nl: "Dutch",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  fi: "Finnish",
  el: "Greek",
  hu: "Hungarian",
  cs: "Czech",
  ro: "Romanian",
  th: "Thai",
  vi: "Vietnamese",
};


const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchNews(selectedCategory, selectedLanguage);
  }, [selectedCategory, selectedLanguage, user, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome to display the confirmation dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const fetchNews = async (category, language) => {
    setLoading(true);
    try {
      const response = await fetch(`https://news-aggregator-backend-h2br.onrender.com/top-headlines?category=${category}&page=1&pageSize=80`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news - ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.data.status === 'ok') {
        const translatedArticles = language !== 'en' ? await translateArticles(data.data.articles, language) : data.data.articles;
        setArticles(translatedArticles);
      } else {
        throw new Error('Failed to fetch news - Invalid response');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const translateArticles = async (articles, targetLanguage) => {
    const apiKey = 'AIzaSyB_AkerIqqCZYuOXIzLvcUKjVSmR6i0_7o';
    const translatedArticles = await Promise.all(articles.map(async article => {
      const translatedTitle = await translateText(article.title, targetLanguage, apiKey);
      const translatedDescription = await translateText(article.description, targetLanguage, apiKey);
      const translatedContent = await translateText(article.content, targetLanguage, apiKey);
      return {
        ...article,
        title: translatedTitle,
        description: translatedDescription,
        content: translatedContent
      };
    }));

    return translatedArticles;
  };

  const translateText = async (text, targetLanguage, apiKey) => {
    const supportedLanguages = [
      'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'ur', 'as', 'si',
      'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'ru', 'pl', 'tr', 'nl', 'sv',
      'da', 'no', 'fi', 'el', 'hu', 'cs', 'ro', 'th', 'vi'
    ];
    if (!supportedLanguages.includes(targetLanguage)) {
      console.warn('Translation not supported for this language:', targetLanguage);
      return text;
    }
  
    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          target: targetLanguage
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return original text in case of error
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
    setHasUnsavedChanges(true);
  };

  const handleChangeLanguage = (language) => {
    setSelectedLanguage(language);
    setHasUnsavedChanges(true);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setHasUnsavedChanges(true);
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

  if (!user) {
    return <div>Loading...</div>;
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
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div className="nav-option">
            <select
              value={selectedLanguage}
              onChange={(e) => handleChangeLanguage(e.target.value)}
              className="nav-select onee"
            >
              {Object.keys(languages).map((lang) => (
                <option key={lang} value={lang}>
                  {languages[lang]}
                </option>
              ))}
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
        <h3 className="welcome-message">Welcome, {user.username}</h3>
        <h2>Top Headlines ({selectedCategory})</h2>
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
