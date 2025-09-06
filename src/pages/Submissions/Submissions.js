import React, { useState } from 'react';
import { submissionsData } from '../../data/mockData';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState(submissionsData);
  const [filter, setFilter] = useState('all');

  const handleApprove = async (submissionId) => {
    // Mock API call to approve submission and issue credits
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'approved' }
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    // Mock blockchain transaction
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    alert(`Submission approved! Credits issued. Transaction: ${transactionHash}`);
  };

  const handleReject = (submissionId) => {
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: 'rejected' }
        : sub
    );
    setSubmissions(updatedSubmissions);
    alert('Submission rejected.');
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge status-pending',
      approved: 'status-badge status-approved',
      rejected: 'status-badge status-rejected'
    };
    return <span className={statusClasses[status]}>{status}</span>;
  };

  const getVerificationIcon = (verified) => {
    return verified ? (
      <span className="verification-success">✅ Tree Detected</span>
    ) : (
      <span className="verification-failed">❌ Not Detected</span>
    );
  };

  const getGoogleMapsLink = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="submissions">
      <div className="page-header">
        <h1 className="page-title">Submissions</h1>
        <p className="page-subtitle">Manage plantation submissions and verification</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-stats">
          <span className="stat-item">
            Total: <strong>{submissions.length}</strong>
          </span>
          <span className="stat-item">
            Pending: <strong>{submissions.filter(s => s.status === 'pending').length}</strong>
          </span>
          <span className="stat-item">
            Approved: <strong>{submissions.filter(s => s.status === 'approved').length}</strong>
          </span>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Plantation Submissions</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Submission ID</th>
                <th>User ID</th>
                <th>GPS Location</th>
                <th>Type</th>
                <th>Area</th>
                <th>Timestamp</th>
                <th>AI Verification</th>
                <th>Status</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <img 
                      src={submission.photo} 
                      alt="Plantation" 
                      className="submission-photo"
                    />
                  </td>
                  <td>
                    <strong>{submission.id}</strong>
                  </td>
                  <td>{submission.userId}</td>
                  <td>
                    <a 
                      href={getGoogleMapsLink(submission.gpsLocation.lat, submission.gpsLocation.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      {submission.gpsLocation.lat.toFixed(4)}, {submission.gpsLocation.lng.toFixed(4)}
                    </a>
                  </td>
                  <td>
                    <span className={`type-badge ${submission.plantationType.toLowerCase()}`}>
                      {submission.plantationType}
                    </span>
                  </td>
                  <td>{submission.area}</td>
                  <td>
                    {new Date(submission.timestamp).toLocaleDateString()} {new Date(submission.timestamp).toLocaleTimeString()}
                  </td>
                  <td>{getVerificationIcon(submission.aiVerification)}</td>
                  <td>{getStatusBadge(submission.status)}</td>
                  <td>
                    <strong>{submission.estimatedCredits}</strong>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {submission.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(submission.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(submission.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {submission.status === 'approved' && (
                        <span className="status-text">Approved</span>
                      )}
                      {submission.status === 'rejected' && (
                        <span className="status-text">Rejected</span>
                      )}
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

export default Submissions;


