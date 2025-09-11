import React, { useState } from 'react';
import './Header.css';
import { motion } from 'framer-motion';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count

  return (
    <header className="header bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="header-left">
        <motion.button 
          className="menu-button" 
          onClick={onMenuClick}
          whileTap={{ scale: 0.95 }}
        >
          ☰
        </motion.button>
        <h1 className="header-title">CarbonTrace Admin</h1>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search submissions, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <motion.div className="notification-icon" whileHover={{ scale: 1.05 }}>
          🔔
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </motion.div>
        <div className="profile-dropdown">
          <div className="profile-avatar">A</div>
          <span className="profile-name">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;


