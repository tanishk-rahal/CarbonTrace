import React, { useState } from 'react';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick}>
          ☰
        </button>
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
        <div className="notification-icon">
          🔔
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </div>
        <div className="profile-dropdown">
          <div className="profile-avatar">A</div>
          <span className="profile-name">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;


