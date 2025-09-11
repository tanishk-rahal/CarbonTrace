// Real API services for CarbonTrace Admin Dashboard
// Connected to Firebase backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const mockResponses = {
  submissions: {
    list: () => Promise.resolve({
      data: require('../data/mockData').submissionsData,
      total: 5,
      page: 1,
      limit: 10
    }),
    approve: (id) => Promise.resolve({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      creditsIssued: 150
    }),
    reject: (id) => Promise.resolve({
      success: true,
      message: 'Submission rejected'
    })
  },
  users: {
    list: () => Promise.resolve({
      data: require('../data/mockData').usersData,
      total: 5
    }),
    getById: (id) => Promise.resolve({
      data: require('../data/mockData').usersData.find(user => user.id === id)
    })
  },
  dashboard: {
    getStats: () => Promise.resolve({
      data: require('../data/mockData').dashboardData.stats
    }),
    getChartData: () => Promise.resolve({
      data: require('../data/mockData').dashboardData.chartData
    }),
    getMapData: () => Promise.resolve({
      data: require('../data/mockData').dashboardData.mapData
    })
  },
  reports: {
    generate: (type, format) => Promise.resolve({
      success: true,
      downloadUrl: `/api/reports/download/${type}.${format}`,
      filename: `report_${type}_${new Date().toISOString().split('T')[0]}.${format}`
    }),
    getSummary: () => Promise.resolve({
      data: require('../data/mockData').reportsData.summary
    })
  },
  blockchain: {
    issueCredits: (userId, amount) => Promise.resolve({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      gasUsed: 21000
    }),
    getBalance: (address) => Promise.resolve({
      balance: Math.floor(Math.random() * 10000),
      credits: Math.floor(Math.random() * 5000)
    })
  },
  ai: {
    verifyImage: (imageUrl) => Promise.resolve({
      success: true,
      result: Math.random() > 0.3 ? 'Tree Detected' : 'Not Detected',
      confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      processingTime: Math.random() * 2 + 1 // 1 to 3 seconds
    })
  }
};

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  getMockResponse(endpoint, options) {
    // Parse endpoint to determine which mock response to return
    if (endpoint.includes('/submissions')) {
      if (options.method === 'POST' && endpoint.includes('/approve')) {
        return mockResponses.submissions.approve();
      }
      if (options.method === 'POST' && endpoint.includes('/reject')) {
        return mockResponses.submissions.reject();
      }
      return mockResponses.submissions.list();
    }
    
    if (endpoint.includes('/users')) {
      return mockResponses.users.list();
    }
    
    if (endpoint.includes('/dashboard')) {
      if (endpoint.includes('/stats')) {
        return mockResponses.dashboard.getStats();
      }
      if (endpoint.includes('/chart')) {
        return mockResponses.dashboard.getChartData();
      }
      if (endpoint.includes('/map')) {
        return mockResponses.dashboard.getMapData();
      }
    }
    
    if (endpoint.includes('/reports')) {
      return mockResponses.reports.generate('monthly', 'csv');
    }
    
    if (endpoint.includes('/blockchain')) {
      if (endpoint.includes('/issue-credits')) {
        return mockResponses.blockchain.issueCredits();
      }
      return mockResponses.blockchain.getBalance();
    }
    
    if (endpoint.includes('/ai')) {
      return mockResponses.ai.verifyImage();
    }
    
    return { success: true, data: null };
  }

  // Submissions API
  async getSubmissions(params = {}) {
    return this.request('/submissions', {
      method: 'GET',
      params
    });
  }

  async approveSubmission(id) {
    return this.request(`/submissions/${id}/approve`, {
      method: 'POST'
    });
  }

  async rejectSubmission(id) {
    return this.request(`/submissions/${id}/reject`, {
      method: 'POST'
    });
  }

  // Users API
  async getUsers(params = {}) {
    return this.request('/users', {
      method: 'GET',
      params
    });
  }

  async getUserById(id) {
    return this.request(`/users/${id}`, {
      method: 'GET'
    });
  }

  // Dashboard API
  async getDashboardStats() {
    return this.request('/dashboard/stats', {
      method: 'GET'
    });
  }

  async getChartData() {
    return this.request('/dashboard/chart', {
      method: 'GET'
    });
  }

  async getMapData() {
    return this.request('/dashboard/map', {
      method: 'GET'
    });
  }

  // Reports API
  async generateReport(type, format) {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, format })
    });
  }

  // Blockchain API
  async issueCredits(userId, amount) {
    return this.request('/blockchain/issue-credits', {
      method: 'POST',
      body: JSON.stringify({ userId, amount })
    });
  }

  async getWalletBalance(address) {
    return this.request(`/blockchain/balance/${address}`, {
      method: 'GET'
    });
  }

  // AI API
  async verifyImage(imageUrl) {
    return this.request('/ai/verify', {
      method: 'POST',
      body: JSON.stringify({ imageUrl })
    });
  }
}

// Create and export API service instance
const apiService = new ApiService();

export default apiService;

// Export individual methods via bound wrappers to preserve `this`
export const getSubmissions = (...args) => apiService.getSubmissions(...args);
export const approveSubmission = (...args) => apiService.approveSubmission(...args);
export const rejectSubmission = (...args) => apiService.rejectSubmission(...args);
export const getUsers = (...args) => apiService.getUsers(...args);
export const getUserById = (...args) => apiService.getUserById(...args);
export const getDashboardStats = (...args) => apiService.getDashboardStats(...args);
export const getChartData = (...args) => apiService.getChartData(...args);
export const getMapData = (...args) => apiService.getMapData(...args);
export const generateReport = (...args) => apiService.generateReport(...args);
export const issueCredits = (...args) => apiService.issueCredits(...args);
export const getWalletBalance = (...args) => apiService.getWalletBalance(...args);
export const verifyImage = (...args) => apiService.verifyImage(...args);


