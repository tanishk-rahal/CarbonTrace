import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/submissions', label: 'Submissions', icon: '📋' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="sidebar-overlay" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <motion.div 
        className={`sidebar ${isOpen ? 'open' : ''} bg-white shadow-soft`}
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <div className="sidebar-header">
          <h1 className="sidebar-title">CarbonTrace</h1>
          <p className="sidebar-subtitle">MRV System Admin</p>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;


