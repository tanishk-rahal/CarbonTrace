const express = require('express');
const { db } = require('../config/firebase');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total plantations
    const plantationsSnapshot = await db.collection('submissions').get();
    const totalPlantations = plantationsSnapshot.size;

    // Get verified submissions
    const verifiedSnapshot = await db.collection('submissions')
      .where('status', '==', 'approved')
      .get();
    const verifiedSubmissions = verifiedSnapshot.size;

    // Get total credits issued
    const creditsSnapshot = await db.collection('carbonCredits')
      .where('status', '==', 'active')
      .get();
    
    let totalCredits = 0;
    creditsSnapshot.forEach(doc => {
      totalCredits += doc.data().amount;
    });

    // Get active users
    const usersSnapshot = await db.collection('users')
      .where('status', '==', 'active')
      .get();
    const activeUsers = usersSnapshot.size;

    // Calculate growth percentages (mock data for now)
    const stats = {
      totalPlantations: totalPlantations.toLocaleString(),
      verifiedSubmissions: verifiedSubmissions.toLocaleString(),
      creditsIssued: totalCredits.toLocaleString(),
      activeUsers: activeUsers.toLocaleString(),
      growth: {
        plantations: '+12%',
        submissions: '+8%',
        credits: '+15%',
        users: '+5%'
      }
    };

    res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get chart data for submissions trend
router.get('/chart', async (req, res) => {
  try {
    const { period = '12' } = req.query; // months
    const months = parseInt(period);
    const chartData = [];

    // Get current date
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      // Get submissions for this month
      const submissionsSnapshot = await db.collection('submissions')
        .where('createdAt', '>=', date)
        .where('createdAt', '<', nextDate)
        .get();
      
      // Get verified submissions for this month
      const verifiedSnapshot = await db.collection('submissions')
        .where('createdAt', '>=', date)
        .where('createdAt', '<', nextDate)
        .where('status', '==', 'approved')
        .get();

      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      chartData.push({
        name: monthName,
        submissions: submissionsSnapshot.size,
        verified: verifiedSnapshot.size
      });
    }

    res.json({ data: chartData });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Get map data for plantation locations
router.get('/map', async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    
    let query = db.collection('submissions');
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const mapData = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.location && data.location.lat && data.location.lng) {
        mapData.push({
          id: doc.id,
          lat: data.location.lat,
          lng: data.location.lng,
          title: `${data.type} Plantation - ${data.location.address || 'Unknown'}`,
          type: data.type,
          verified: data.status === 'approved',
          date: data.createdAt?.toDate?.()?.toISOString().split('T')[0] || 'Unknown',
          credits: data.estimatedCredits || 0,
          status: data.status
        });
      }
    });

    res.json({ data: mapData });
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get recent submissions
    const submissionsSnapshot = await db.collection('submissions')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    const activities = [];
    
    submissionsSnapshot.forEach(doc => {
      const data = doc.data();
      const timeAgo = getTimeAgo(data.createdAt?.toDate?.());
      
      activities.push({
        id: doc.id,
        icon: '🌱',
        text: `New ${data.type} plantation submitted by ${data.userId}`,
        time: timeAgo,
        type: 'submission'
      });
    });

    // Get recent credit issuances
    const creditsSnapshot = await db.collection('carbonCredits')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    creditsSnapshot.forEach(doc => {
      const data = doc.data();
      const timeAgo = getTimeAgo(data.createdAt?.toDate?.());
      
      activities.push({
        id: doc.id,
        icon: '💰',
        text: `${data.amount} carbon credits issued to user`,
        time: timeAgo,
        type: 'credit_issuance'
      });
    });

    // Sort by time and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities.splice(parseInt(limit));

    res.json({ data: activities });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

module.exports = router;

