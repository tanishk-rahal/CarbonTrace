import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard/StatsCard';
import Chart from '../../components/Chart/Chart';
import Map from '../../components/Map/Map';
import { getDashboardStats, getChartData, getMapData } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPlantations: '0',
    verifiedSubmissions: '0',
    creditsIssued: '0',
    activeUsers: '0'
  });
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, chartResponse, mapResponse] = await Promise.all([
          getDashboardStats(),
          getChartData(),
          getMapData()
        ]);

        setStats(statsResponse.data);
        setChartData(chartResponse.data);
        setMapData(mapResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        // Fallback to mock data
        setStats({
          totalPlantations: '2,847',
          verifiedSubmissions: '1,923',
          creditsIssued: '45,670',
          activeUsers: '156'
        });
        setChartData([
          { name: 'Jan', submissions: 120, verified: 95 },
          { name: 'Feb', submissions: 150, verified: 120 },
          { name: 'Mar', submissions: 180, verified: 145 },
          { name: 'Apr', submissions: 200, verified: 165 },
          { name: 'May', submissions: 220, verified: 185 },
          { name: 'Jun', submissions: 250, verified: 210 }
        ]);
        setMapData([]);
        setRecentActivity([
          { icon: '🌱', text: 'New mangrove plantation submitted by user_123', time: '2 minutes ago' },
          { icon: '✅', text: 'Plantation verification completed for submission #2847', time: '15 minutes ago' },
          { icon: '💰', text: '150 carbon credits issued to user_456', time: '1 hour ago' },
          { icon: '👥', text: 'New user registration: environmental_ngo_789', time: '2 hours ago' },
          { icon: '📊', text: 'Monthly report generated for January 2024', time: '3 hours ago' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard px-4 md:px-6">
      <div className="page-header mb-6">
        <h1 className="page-title text-3xl font-semibold text-eco mb-1">Dashboard</h1>
        <p className="page-subtitle text-slate-600">Overview of CarbonTrace MRV System</p>
        {error && <div className="alert alert-warning mt-3">{error}</div>}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-aos="fade-up" data-aos-delay="50">
        <StatsCard
          title="Total Plantations"
          value={stats.totalPlantations}
          change="+12%"
          changeType="positive"
          icon="🌱"
        />
        <StatsCard
          title="Verified Submissions"
          value={stats.verifiedSubmissions}
          change="+8%"
          changeType="positive"
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Credits Issued"
          value={stats.creditsIssued}
          change="+15%"
          changeType="positive"
          icon="💰"
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          change="+5%"
          changeType="positive"
          icon="👥"
          color="orange"
        />
      </div>

      {/* Charts and Map Row */}
      <div className="dashboard-content grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="chart-section" data-aos="fade-up" data-aos-delay="100">
          <div className="card bg-white rounded-xl shadow-soft">
            <div className="card-header">
              <h3 className="card-title">Submissions Trend</h3>
            </div>
            <Chart data={chartData} type="line" />
          </div>
        </div>

        <div className="map-section" data-aos="fade-up" data-aos-delay="150">
          <div className="card bg-white rounded-xl shadow-soft">
            <div className="card-header">
              <h3 className="card-title">Plantation Locations</h3>
            </div>
            <Map data={mapData} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity" data-aos="fade-up" data-aos-delay="200">
        <div className="card bg-white rounded-xl shadow-soft">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


