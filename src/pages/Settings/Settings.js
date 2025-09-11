import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@carbontrace.org',
    organization: 'CarbonTrace',
    role: 'System Administrator',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-5',
    language: 'English'
  });

  const [apiKeys, setApiKeys] = useState({
    blockchainRpc: 'https://mainnet.infura.io/v3/your-key-here',
    aiServiceKey: 'sk-1234567890abcdef',
    mapApiKey: 'AIzaSyBvOkBwvKzKzKzKzKzKzKzKzKzKzKzKzKzK',
    emailServiceKey: 'SG.1234567890abcdef',
    storageBucket: 'carbontrace-uploads'
  });

  const [systemConfig, setSystemConfig] = useState({
    creditValue: 10,
    verificationThreshold: 0.8,
    autoApproval: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    debugMode: false
  });

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleApiKeyUpdate = (field, value) => {
    setApiKeys(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigUpdate = (field, value) => {
    setSystemConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleTestConnection = (service) => {
    alert(`Testing ${service} connection...`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'system', label: 'System', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="settings">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and system configuration</p>
      </div>

      <div className="settings-container">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Profile Information</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Organization</label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => handleProfileUpdate('organization', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => handleProfileUpdate('role', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => handleProfileUpdate('timezone', e.target.value)}
                      className="form-select"
                    >
                      <option value="UTC-5">UTC-5 (EST)</option>
                      <option value="UTC-0">UTC+0 (GMT)</option>
                      <option value="UTC+5:30">UTC+5:30 (IST)</option>
                      <option value="UTC+8">UTC+8 (CST)</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="settings-section">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">API Keys & Configuration</h3>
                  <p className="card-subtitle">Configure external service integrations</p>
                </div>
                <div className="api-keys">
                  <div className="api-key-item">
                    <div className="api-key-info">
                      <h4>Blockchain RPC</h4>
                      <p>Ethereum mainnet connection for smart contracts</p>
                    </div>
                    <div className="api-key-input">
                      <input
                        type="password"
                        value={apiKeys.blockchainRpc}
                        onChange={(e) => handleApiKeyUpdate('blockchainRpc', e.target.value)}
                        className="form-input"
                        placeholder="https://mainnet.infura.io/v3/..."
                      />
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleTestConnection('Blockchain RPC')}
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  <div className="api-key-item">
                    <div className="api-key-info">
                      <h4>AI Service Key</h4>
                      <p>Machine learning service for image verification</p>
                    </div>
                    <div className="api-key-input">
                      <input
                        type="password"
                        value={apiKeys.aiServiceKey}
                        onChange={(e) => handleApiKeyUpdate('aiServiceKey', e.target.value)}
                        className="form-input"
                        placeholder="sk-..."
                      />
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleTestConnection('AI Service')}
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  <div className="api-key-item">
                    <div className="api-key-info">
                      <h4>Google Maps API</h4>
                      <p>For location services and mapping</p>
                    </div>
                    <div className="api-key-input">
                      <input
                        type="password"
                        value={apiKeys.mapApiKey}
                        onChange={(e) => handleApiKeyUpdate('mapApiKey', e.target.value)}
                        className="form-input"
                        placeholder="AIzaSy..."
                      />
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleTestConnection('Google Maps')}
                      >
                        Test
                      </button>
                    </div>
                  </div>

                  <div className="api-key-item">
                    <div className="api-key-info">
                      <h4>Email Service</h4>
                      <p>SendGrid API for email notifications</p>
                    </div>
                    <div className="api-key-input">
                      <input
                        type="password"
                        value={apiKeys.emailServiceKey}
                        onChange={(e) => handleApiKeyUpdate('emailServiceKey', e.target.value)}
                        className="form-input"
                        placeholder="SG..."
                      />
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleTestConnection('Email Service')}
                      >
                        Test
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save API Keys
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-section">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">System Configuration</h3>
                  <p className="card-subtitle">Configure system behavior and parameters</p>
                </div>
                <div className="config-grid">
                  <div className="config-item">
                    <div className="config-info">
                      <h4>Credit Value (USD)</h4>
                      <p>Value of each carbon credit in USD</p>
                    </div>
                    <input
                      type="number"
                      value={systemConfig.creditValue}
                      onChange={(e) => handleConfigUpdate('creditValue', parseFloat(e.target.value))}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="config-item">
                    <div className="config-info">
                      <h4>AI Verification Threshold</h4>
                      <p>Minimum confidence score for auto-approval</p>
                    </div>
                    <input
                      type="range"
                      value={systemConfig.verificationThreshold}
                      onChange={(e) => handleConfigUpdate('verificationThreshold', parseFloat(e.target.value))}
                      className="form-range"
                      min="0"
                      max="1"
                      step="0.1"
                    />
                    <span className="range-value">{systemConfig.verificationThreshold}</span>
                  </div>

                  <div className="config-item">
                    <div className="config-info">
                      <h4>Auto-Approval</h4>
                      <p>Automatically approve submissions above threshold</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={systemConfig.autoApproval}
                        onChange={(e) => handleConfigUpdate('autoApproval', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="config-item">
                    <div className="config-info">
                      <h4>Maintenance Mode</h4>
                      <p>Disable system for maintenance</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={systemConfig.maintenanceMode}
                        onChange={(e) => handleConfigUpdate('maintenanceMode', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="config-item">
                    <div className="config-info">
                      <h4>Debug Mode</h4>
                      <p>Enable detailed logging and debugging</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={systemConfig.debugMode}
                        onChange={(e) => handleConfigUpdate('debugMode', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Notification Preferences</h3>
                  <p className="card-subtitle">Configure how you receive notifications</p>
                </div>
                <div className="notification-settings">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Email Notifications</h4>
                      <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={systemConfig.emailNotifications}
                        onChange={(e) => handleConfigUpdate('emailNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>SMS Notifications</h4>
                      <p>Receive urgent notifications via SMS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={systemConfig.smsNotifications}
                        onChange={(e) => handleConfigUpdate('smsNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;


