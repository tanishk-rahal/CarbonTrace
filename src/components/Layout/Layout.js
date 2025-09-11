import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="main-layout min-h-screen bg-base-100 md:flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content flex-1 md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="content-area p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;


