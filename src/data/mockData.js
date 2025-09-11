// Mock data for CarbonTrace Admin Dashboard

export const dashboardData = {
  stats: {
    totalPlantations: '2,847',
    verifiedSubmissions: '1,923',
    creditsIssued: '45,670',
    activeUsers: '156'
  },
  chartData: [
    { name: 'Jan', submissions: 120, verified: 95 },
    { name: 'Feb', submissions: 150, verified: 120 },
    { name: 'Mar', submissions: 180, verified: 145 },
    { name: 'Apr', submissions: 200, verified: 165 },
    { name: 'May', submissions: 220, verified: 185 },
    { name: 'Jun', submissions: 250, verified: 210 },
    { name: 'Jul', submissions: 280, verified: 235 },
    { name: 'Aug', submissions: 300, verified: 255 },
    { name: 'Sep', submissions: 320, verified: 275 },
    { name: 'Oct', submissions: 350, verified: 295 },
    { name: 'Nov', submissions: 380, verified: 315 },
    { name: 'Dec', submissions: 400, verified: 335 }
  ],
  mapData: [
    {
      lat: 12.9716,
      lng: 77.5946,
      title: 'Mangrove Plantation - Bangalore',
      type: 'Mangrove',
      verified: true,
      date: '2024-01-15',
      credits: 150
    },
    {
      lat: 19.0760,
      lng: 72.8777,
      title: 'Seagrass Restoration - Mumbai',
      type: 'Seagrass',
      verified: true,
      date: '2024-01-20',
      credits: 200
    },
    {
      lat: 13.0827,
      lng: 80.2707,
      title: 'Mangrove Conservation - Chennai',
      type: 'Mangrove',
      verified: false,
      date: '2024-01-25',
      credits: 0
    },
    {
      lat: 22.5726,
      lng: 88.3639,
      title: 'Sundarbans Restoration - Kolkata',
      type: 'Mangrove',
      verified: true,
      date: '2024-01-30',
      credits: 300
    },
    {
      lat: 8.5241,
      lng: 76.9366,
      title: 'Kerala Coastal Restoration',
      type: 'Seagrass',
      verified: false,
      date: '2024-02-01',
      credits: 0
    }
  ],
  recentActivity: [
    {
      icon: '🌱',
      text: 'New mangrove plantation submitted by user_123',
      time: '2 minutes ago'
    },
    {
      icon: '✅',
      text: 'Plantation verification completed for submission #2847',
      time: '15 minutes ago'
    },
    {
      icon: '💰',
      text: '150 carbon credits issued to user_456',
      time: '1 hour ago'
    },
    {
      icon: '👥',
      text: 'New user registration: environmental_ngo_789',
      time: '2 hours ago'
    },
    {
      icon: '📊',
      text: 'Monthly report generated for January 2024',
      time: '3 hours ago'
    }
  ]
};

export const submissionsData = [
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
  },
  {
    id: 'SUB-002',
    userId: 'user_456',
    photo: 'https://via.placeholder.com/60x60/1565C0/white?text=S',
    gpsLocation: { lat: 19.0760, lng: 72.8777 },
    timestamp: '2024-02-01T09:15:00Z',
    aiVerification: true,
    status: 'approved',
    plantationType: 'Seagrass',
    area: '1.8 acres',
    estimatedCredits: 200
  },
  {
    id: 'SUB-003',
    userId: 'user_789',
    photo: 'https://via.placeholder.com/60x60/FF9800/white?text=M',
    gpsLocation: { lat: 13.0827, lng: 80.2707 },
    timestamp: '2024-02-01T08:45:00Z',
    aiVerification: false,
    status: 'rejected',
    plantationType: 'Mangrove',
    area: '3.2 acres',
    estimatedCredits: 0
  },
  {
    id: 'SUB-004',
    userId: 'user_101',
    photo: 'https://via.placeholder.com/60x60/4CAF50/white?text=S',
    gpsLocation: { lat: 22.5726, lng: 88.3639 },
    timestamp: '2024-01-31T16:20:00Z',
    aiVerification: true,
    status: 'approved',
    plantationType: 'Seagrass',
    area: '2.1 acres',
    estimatedCredits: 180
  },
  {
    id: 'SUB-005',
    userId: 'user_202',
    photo: 'https://via.placeholder.com/60x60/1565C0/white?text=M',
    gpsLocation: { lat: 8.5241, lng: 76.9366 },
    timestamp: '2024-01-31T14:10:00Z',
    aiVerification: true,
    status: 'pending',
    plantationType: 'Mangrove',
    area: '1.5 acres',
    estimatedCredits: 120
  }
];

export const usersData = [
  {
    id: 'user_123',
    name: 'Green Earth NGO',
    email: 'contact@greenearth.org',
    walletBalance: 1250,
    totalSubmissions: 15,
    verifiedSubmissions: 12,
    joinDate: '2023-06-15',
    status: 'active',
    organization: 'NGO'
  },
  {
    id: 'user_456',
    name: 'Marine Conservation Society',
    email: 'info@marineconservation.org',
    walletBalance: 2100,
    totalSubmissions: 22,
    verifiedSubmissions: 18,
    joinDate: '2023-04-20',
    status: 'active',
    organization: 'NGO'
  },
  {
    id: 'user_789',
    name: 'Coastal Restoration Group',
    email: 'admin@coastalrestoration.org',
    walletBalance: 850,
    totalSubmissions: 8,
    verifiedSubmissions: 6,
    joinDate: '2023-08-10',
    status: 'active',
    organization: 'Government'
  },
  {
    id: 'user_101',
    name: 'Eco Warriors Foundation',
    email: 'team@ecowarriors.org',
    walletBalance: 3200,
    totalSubmissions: 35,
    verifiedSubmissions: 32,
    joinDate: '2023-02-01',
    status: 'active',
    organization: 'NGO'
  },
  {
    id: 'user_202',
    name: 'Blue Carbon Initiative',
    email: 'contact@bluecarbon.org',
    walletBalance: 1800,
    totalSubmissions: 19,
    verifiedSubmissions: 16,
    joinDate: '2023-05-15',
    status: 'active',
    organization: 'NGO'
  }
];

export const reportsData = {
  summary: {
    totalSubmissions: 2847,
    verifiedSubmissions: 1923,
    rejectedSubmissions: 924,
    totalCreditsIssued: 45670,
    averageVerificationTime: '2.3 days'
  },
  monthlyData: [
    { month: 'Jan 2024', submissions: 120, verified: 95, credits: 14250 },
    { month: 'Feb 2024', submissions: 150, verified: 120, credits: 18000 },
    { month: 'Mar 2024', submissions: 180, verified: 145, credits: 21750 },
    { month: 'Apr 2024', submissions: 200, verified: 165, credits: 24750 },
    { month: 'May 2024', submissions: 220, verified: 185, credits: 27750 },
    { month: 'Jun 2024', submissions: 250, verified: 210, credits: 31500 },
    { month: 'Jul 2024', submissions: 280, verified: 235, credits: 35250 },
    { month: 'Aug 2024', submissions: 300, verified: 255, credits: 38250 },
    { month: 'Sep 2024', submissions: 320, verified: 275, credits: 41250 },
    { month: 'Oct 2024', submissions: 350, verified: 295, credits: 44250 },
    { month: 'Nov 2024', submissions: 380, verified: 315, credits: 47250 },
    { month: 'Dec 2024', submissions: 400, verified: 335, credits: 50250 }
  ],
  aiVerificationLogs: [
    {
      id: 'AI-001',
      submissionId: 'SUB-001',
      timestamp: '2024-02-01T10:35:00Z',
      result: 'Tree Detected',
      confidence: 0.92,
      processingTime: '2.3s'
    },
    {
      id: 'AI-002',
      submissionId: 'SUB-002',
      timestamp: '2024-02-01T09:20:00Z',
      result: 'Tree Detected',
      confidence: 0.88,
      processingTime: '1.8s'
    },
    {
      id: 'AI-003',
      submissionId: 'SUB-003',
      timestamp: '2024-02-01T08:50:00Z',
      result: 'Not Detected',
      confidence: 0.15,
      processingTime: '2.1s'
    }
  ]
};


