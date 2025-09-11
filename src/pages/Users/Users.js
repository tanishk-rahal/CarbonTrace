import React, { useState } from 'react';
import { usersData } from '../../data/mockData';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState(usersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrg, setFilterOrg] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = filterOrg === 'all' || user.organization === filterOrg;
    return matchesSearch && matchesOrg;
  });

  const getOrganizationBadge = (org) => {
    const orgClasses = {
      'NGO': 'org-badge ngo',
      'Government': 'org-badge government',
      'Private': 'org-badge private'
    };
    return <span className={orgClasses[org] || 'org-badge'}>{org}</span>;
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="status-badge status-active">Active</span>
    ) : (
      <span className="status-badge status-inactive">Inactive</span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVerificationRate = (total, verified) => {
    return total > 0 ? Math.round((verified / total) * 100) : 0;
  };

  return (
    <div className="users">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Manage user accounts and wallet balances</p>
      </div>

      {/* Search and Filters */}
      <div className="filters">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div className="filter-section">
          <div className="filter-group">
            <label>Organization:</label>
            <select 
              value={filterOrg} 
              onChange={(e) => setFilterOrg(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Organizations</option>
              <option value="NGO">NGO</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Credits</h3>
            <p className="stat-value">{users.reduce((sum, user) => sum + user.walletBalance, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Avg. Verification Rate</h3>
            <p className="stat-value">
              {Math.round(users.reduce((sum, user) => sum + getVerificationRate(user.totalSubmissions, user.verifiedSubmissions), 0) / users.length)}%
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Directory</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Export CSV</button>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Organization</th>
                <th>Wallet Balance</th>
                <th>Submissions</th>
                <th>Verification Rate</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getOrganizationBadge(user.organization)}</td>
                  <td>
                    <div className="wallet-balance">
                      <span className="credits-amount">{user.walletBalance.toLocaleString()}</span>
                      <span className="credits-label">credits</span>
                    </div>
                  </td>
                  <td>
                    <div className="submission-stats">
                      <div className="submission-total">
                        <strong>{user.totalSubmissions}</strong> total
                      </div>
                      <div className="submission-verified">
                        <span className="verified-count">{user.verifiedSubmissions}</span> verified
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="verification-rate">
                      <div className="rate-percentage">
                        {getVerificationRate(user.totalSubmissions, user.verifiedSubmissions)}%
                      </div>
                      <div className="rate-bar">
                        <div 
                          className="rate-fill"
                          style={{ 
                            width: `${getVerificationRate(user.totalSubmissions, user.verifiedSubmissions)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(user.joinDate)}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-outline btn-sm">View Details</button>
                      <button className="btn btn-secondary btn-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;


