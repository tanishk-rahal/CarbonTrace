import React, { useEffect, useState } from 'react';
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

  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : false));

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isDesktop && isOpen && (
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
        className={`sidebar ${isOpen ? 'open' : ''} bg-white shadow-soft fixed left-0 top-0 h-screen w-64 z-[1000] md:translate-x-0 md:static`}
        initial={{ x: -260 }}
        animate={{ x: isDesktop ? 0 : (isOpen ? 0 : -260) }}
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


