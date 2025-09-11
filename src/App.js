import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Submissions from './pages/Submissions/Submissions';
import Users from './pages/Users/Users';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 20, easing: 'ease-out' });
  }, []);

  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;


