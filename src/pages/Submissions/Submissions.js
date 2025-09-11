import React, { useState, useEffect } from 'react';
import { getSubmissions, approveSubmission, rejectSubmission } from '../../services/api';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmissions();
      setSubmissions(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
      // Fallback to mock data
      setSubmissions([
        {
          id: 'SUB-001',
          userId: 'user_123',
          photo: 'https://via.placeholder.com/60x60/4CAF50/white?text=M',
          gpsLocation: { lat: 12.9716, lng: 77.5946 },
          timestamp: '2024-02-01T10:30:00Z',
          aiVerification: true,
          status: 'pending',
          plantationType: 'Mangrove',
          area: '2.5 acres',
          estimatedCredits: 150
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      const response = await approveSubmission(submissionId);
      
      // Update local state
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'approved' }
          : sub
      );
      setSubmissions(updatedSubmissions);
      
      alert(`Submission approved! Credits issued. Transaction: ${response.transactionHash}`);
    } catch (err) {
      console.error('Error approving submission:', err);
      alert('Failed to approve submission: ' + err.message);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;
      
      await rejectSubmission(submissionId, reason);
      
      // Update local state
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'rejected' }
          : sub
      );
      setSubmissions(updatedSubmissions);
      alert('Submission rejected.');
    } catch (err) {
      console.error('Error rejecting submission:', err);
      alert('Failed to reject submission: ' + err.message);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    return (sub.status || '').toLowerCase() === filter;
  });

  // Helpers to support both mock and backend shapes safely
  const getPhotoUrl = (submission) => {
    if (submission.photo) return submission.photo;
    const img = Array.isArray(submission.images) && submission.images.length > 0 ? submission.images[0] : null;
    return img?.thumbnail || img?.url || 'https://via.placeholder.com/60x60/EEEEEE/000?text=+';
  };

  const getLat = (submission) => {
    if (submission.gpsLocation?.lat != null) return submission.gpsLocation.lat;
    if (submission.location?.lat != null) return submission.location.lat;
    return null;
  };

  const getLng = (submission) => {
    if (submission.gpsLocation?.lng != null) return submission.gpsLocation.lng;
    if (submission.location?.lng != null) return submission.location.lng;
    return null;
  };

  const getType = (submission) => submission.plantationType || submission.type || '-';

  const getArea = (submission) => submission.area || '-';

  const getTimestamp = (submission) => submission.timestamp || submission.createdAt || null;

  const isAiVerified = (submission) => {
    if (typeof submission.aiVerification === 'boolean') return submission.aiVerification;
    if (submission.aiVerification?.result) return submission.aiVerification.result === 'verified';
    return false;
  };

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
              {filteredSubmissions.map((submission) => {
                const lat = getLat(submission);
                const lng = getLng(submission);
                const type = getType(submission);
                const ts = getTimestamp(submission);
                const status = (submission.status || '').toLowerCase();
                return (
                  <tr key={submission.id}>
                    <td>
                      <img 
                        src={getPhotoUrl(submission)} 
                        alt="Plantation" 
                        className="submission-photo"
                      />
                    </td>
                    <td>
                      <strong>{submission.id}</strong>
                    </td>
                    <td>{submission.userId}</td>
                    <td>
                      {lat != null && lng != null ? (
                        <a 
                          href={getGoogleMapsLink(lat, lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="location-link"
                        >
                          {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <span className={`type-badge ${String(type).toLowerCase()}`}>
                        {type}
                      </span>
                    </td>
                    <td>{getArea(submission)}</td>
                    <td>
                      {ts ? (
                        <>
                          {new Date(ts).toLocaleDateString()} {new Date(ts).toLocaleTimeString()}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{getVerificationIcon(isAiVerified(submission))}</td>
                    <td>{getStatusBadge(status)}</td>
                    <td>
                      <strong>{submission.estimatedCredits ?? '-'}</strong>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {status === 'pending' && (
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
                        {status === 'approved' && (
                          <span className="status-text">Approved</span>
                        )}
                        {status === 'rejected' && (
                          <span className="status-text">Rejected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Submissions;


