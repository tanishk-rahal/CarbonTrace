import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, change, changeType, icon, color = 'default' }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
          <p className="stat-label">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {change && (
            <span className={`stat-change ${changeType}`}>
              {change} from last month
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;


