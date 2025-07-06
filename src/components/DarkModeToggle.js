import React from 'react';
import '../styles/DarkModeToggle.css';

const DarkModeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`dark-mode-toggle ${darkMode ? 'dark' : 'light'}`}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-icon">
            {darkMode ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;