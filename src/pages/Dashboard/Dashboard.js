import React from 'react';
import StatsCard from '../../components/StatsCard/StatsCard';
import Chart from '../../components/Chart/Chart';
import Map from '../../components/Map/Map';
import { dashboardData } from '../../data/mockData';
import './Dashboard.css';

const Dashboard = () => {
  const stats = dashboardData.stats;
  const chartData = dashboardData.chartData;
  const mapData = dashboardData.mapData;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of CarbonTrace MRV System</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
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
      <div className="dashboard-content">
        <div className="chart-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Submissions Trend</h3>
            </div>
            <Chart data={chartData} type="line" />
          </div>
        </div>

        <div className="map-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Plantation Locations</h3>
            </div>
            <Map data={mapData} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            {dashboardData.recentActivity.map((activity, index) => (
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


