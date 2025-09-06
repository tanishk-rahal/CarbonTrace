import React, { useState } from 'react';
import Chart from '../../components/Chart/Chart';
import { reportsData } from '../../data/mockData';
import './Reports.css';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [dateRange, setDateRange] = useState('12months');

  const handleExport = (format) => {
    // Mock export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const getSummaryStats = () => {
    const { summary } = reportsData;
    return [
      {
        title: 'Total Submissions',
        value: summary.totalSubmissions.toLocaleString(),
        icon: '📋',
        color: 'blue'
      },
      {
        title: 'Verification Rate',
        value: `${Math.round((summary.verifiedSubmissions / summary.totalSubmissions) * 100)}%`,
        icon: '✅',
        color: 'green'
      },
      {
        title: 'Credits Issued',
        value: summary.totalCreditsIssued.toLocaleString(),
        icon: '💰',
        color: 'orange'
      },
      {
        title: 'Avg. Processing Time',
        value: summary.averageVerificationTime,
        icon: '⏱️',
        color: 'blue'
      }
    ];
  };

  const getChartData = () => {
    if (selectedReport === 'monthly') {
      return reportsData.monthlyData.map(item => ({
        name: item.month.split(' ')[0],
        submissions: item.submissions,
        verified: item.verified,
        credits: item.credits
      }));
    }
    return reportsData.monthlyData;
  };

  const getPieChartData = () => {
    const { summary } = reportsData;
    return [
      { name: 'Verified', value: summary.verifiedSubmissions },
      { name: 'Rejected', value: summary.rejectedSubmissions }
    ];
  };

  return (
    <div className="reports">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and analyze system reports</p>
      </div>

      {/* Report Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select 
            value={selectedReport} 
            onChange={(e) => setSelectedReport(e.target.value)}
            className="control-select"
          >
            <option value="monthly">Monthly Overview</option>
            <option value="quarterly">Quarterly Analysis</option>
            <option value="yearly">Yearly Summary</option>
          </select>
        </div>
        <div className="control-group">
          <label>Date Range:</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="control-select"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className="export-buttons">
          <button 
            className="btn btn-outline"
            onClick={() => handleExport('csv')}
          >
            📊 Export CSV
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => handleExport('pdf')}
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        {getSummaryStats().map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">Submissions Trend</h3>
            </div>
            <Chart data={getChartData()} type="line" height={300} />
          </div>
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">Verification Status</h3>
            </div>
            <Chart data={getPieChartData()} type="pie" height={300} />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">Credits Issued by Month</h3>
            </div>
            <Chart 
              data={getChartData().map(item => ({ name: item.name, value: item.credits }))} 
              type="bar" 
              height={300} 
            />
          </div>
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">Verification Rate Trend</h3>
            </div>
            <Chart 
              data={getChartData().map(item => ({ 
                name: item.name, 
                value: Math.round((item.verified / item.submissions) * 100) 
              }))} 
              type="bar" 
              height={300} 
            />
          </div>
        </div>
      </div>

      {/* AI Verification Logs */}
      <div className="logs-section">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">AI Verification Logs</h3>
            <div className="table-actions">
              <button className="btn btn-outline btn-sm">Export Logs</button>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Submission ID</th>
                  <th>Timestamp</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Processing Time</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.aiVerificationLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <code className="log-id">{log.id}</code>
                    </td>
                    <td>
                      <strong>{log.submissionId}</strong>
                    </td>
                    <td>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`verification-result ${log.result.toLowerCase().replace(' ', '-')}`}>
                        {log.result}
                      </span>
                    </td>
                    <td>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${log.confidence * 100}%` }}
                        ></div>
                        <span className="confidence-text">
                          {Math.round(log.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="processing-time">{log.processingTime}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


