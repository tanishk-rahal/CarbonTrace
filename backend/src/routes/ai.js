const express = require('express');
const axios = require('axios');

const router = express.Router();

// AI Service Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_API_KEY = process.env.AI_API_KEY;

// Verify image with AI service
router.post('/verify', async (req, res) => {
  try {
    const { imageUrl, submissionId } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Call external AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/verify-image`, {
      image_url: imageUrl,
      submission_id: submissionId
    }, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const result = {
      success: true,
      result: aiResponse.data.result,
      confidence: aiResponse.data.confidence,
      processingTime: aiResponse.data.processing_time,
      details: aiResponse.data.details || {}
    };

    res.json(result);
  } catch (error) {
    console.error('AI verification error:', error);
    
    // Fallback to mock response if AI service is unavailable
    const mockResult = {
      success: true,
      result: Math.random() > 0.3 ? 'verified' : 'rejected',
      confidence: Math.random() * 0.4 + 0.6,
      processingTime: Math.random() * 2 + 1,
      details: {
        message: 'AI service unavailable, using fallback verification',
        fallback: true
      }
    };

    res.json(mockResult);
  }
});

// Calculate carbon credits based on image analysis
router.post('/calculate-credits', async (req, res) => {
  try {
    const { imageUrl, area, type, submissionId } = req.body;
    
    if (!imageUrl || !area || !type) {
      return res.status(400).json({ error: 'Image URL, area, and type are required' });
    }

    // Call AI service for credit calculation
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/calculate-credits`, {
      image_url: imageUrl,
      area: parseFloat(area),
      type: type,
      submission_id: submissionId
    }, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const result = {
      success: true,
      credits: aiResponse.data.credits,
      confidence: aiResponse.data.confidence,
      factors: aiResponse.data.factors || {},
      processingTime: aiResponse.data.processing_time
    };

    res.json(result);
  } catch (error) {
    console.error('AI credit calculation error:', error);
    
    // Fallback calculation
    const creditMultiplier = {
      mangrove: 150,
      seagrass: 100,
      coral: 200
    };
    
    const fallbackCredits = Math.floor(area * (creditMultiplier[type] || 100));
    
    const mockResult = {
      success: true,
      credits: fallbackCredits,
      confidence: 0.7,
      factors: {
        area: area,
        type: type,
        baseMultiplier: creditMultiplier[type] || 100
      },
      processingTime: 1.5,
      fallback: true
    };

    res.json(mockResult);
  }
});

// Get AI verification history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // This would typically query a database of AI verification logs
    // For now, return mock data
    const mockHistory = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      id: `AI-${String(i + 1).padStart(3, '0')}`,
      submissionId: `SUB-${String(i + 1).padStart(3, '0')}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      result: Math.random() > 0.3 ? 'verified' : 'rejected',
      confidence: Math.random() * 0.4 + 0.6,
      processingTime: Math.random() * 2 + 1,
      imageUrl: `https://example.com/image${i + 1}.jpg`
    }));

    res.json({
      data: mockHistory,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: 100
      }
    });
  } catch (error) {
    console.error('Error fetching AI history:', error);
    res.status(500).json({ error: 'Failed to fetch AI verification history' });
  }
});

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000
    });
    
    res.json({
      status: 'OK',
      aiService: 'connected',
      responseTime: response.data.response_time || 'unknown'
    });
  } catch (error) {
    res.json({
      status: 'WARNING',
      aiService: 'disconnected',
      message: 'AI service is not available, using fallback mode'
    });
  }
});

module.exports = router;





