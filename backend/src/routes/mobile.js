const express = require('express');
const { admin, db } = require('../config/firebase');
const { carbonCreditContract, adminWallet } = require('../config/blockchain');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer for Android image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 images per submission
  }
});

// Android-optimized submission creation
router.post('/submit', upload.array('images', 5), async (req, res) => {
  try {
    const { 
      userId, 
      type, 
      latitude, 
      longitude, 
      area, 
      description,
      deviceInfo,
      appVersion 
    } = req.body;
    
    if (!userId || !type || !latitude || !longitude || !area) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'type', 'latitude', 'longitude', 'area']
      });
    }

    const submissionId = uuidv4();
    const images = [];

    // Process uploaded images for Android
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageId = uuidv4();
        
        // Optimize image for mobile display
        const processedImage = await sharp(file.buffer)
          .resize(800, 600, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Create thumbnail for faster loading
        const thumbnail = await sharp(file.buffer)
          .resize(200, 150, { fit: 'inside' })
          .jpeg({ quality: 60 })
          .toBuffer();

        // Upload to Firebase Storage
        const bucket = admin.storage().bucket();
        
        // Upload main image
        const mainImageUpload = bucket.file(`submissions/${submissionId}/${imageId}.jpg`);
        await mainImageUpload.save(processedImage, {
          metadata: {
            contentType: 'image/jpeg',
            metadata: {
              submissionId,
              userId,
              type,
              deviceInfo: deviceInfo || 'Android'
            }
          }
        });

        // Upload thumbnail
        const thumbnailUpload = bucket.file(`submissions/${submissionId}/${imageId}_thumb.jpg`);
        await thumbnailUpload.save(thumbnail, {
          metadata: {
            contentType: 'image/jpeg'
          }
        });

        images.push({
          id: imageId,
          url: `https://storage.googleapis.com/${bucket.name}/submissions/${submissionId}/${imageId}.jpg`,
          thumbnail: `https://storage.googleapis.com/${bucket.name}/submissions/${submissionId}/${imageId}_thumb.jpg`,
          originalName: file.originalname,
          size: file.size
        });
      }
    }

    // Calculate estimated credits based on area and type
    const creditMultiplier = {
      mangrove: 150,
      seagrass: 100,
      coral: 200
    };
    const estimatedCredits = Math.floor(area * (creditMultiplier[type] || 100));

    const submission = {
      id: submissionId,
      userId,
      type,
      location: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        address: '' // Will be filled by geocoding service
      },
      area: parseFloat(area),
      description: description || '',
      images,
      estimatedCredits,
      status: 'pending',
      deviceInfo: {
        platform: 'Android',
        version: appVersion || '1.0.0',
        device: deviceInfo || 'Unknown'
      },
      aiVerification: {
        result: 'pending',
        confidence: 0,
        processingTime: 0,
        timestamp: null
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('submissions').doc(submissionId).set(submission);

    // Best-effort: record location on-chain if enabled and contract supports it
    try {
      if (process.env.ENABLE_ONCHAIN_LOCATION === 'true') {
        const latE7 = Math.round(parseFloat(latitude) * 1e7);
        const lngE7 = Math.round(parseFloat(longitude) * 1e7);
        const tx = await carbonCreditContract.methods
          .recordSubmissionLocation(web3.utils.toBN(submissionId.replace(/[^0-9]/g, '') || '0'), latE7, lngE7)
          .send({ from: adminWallet.address, gas: 150000 });

        await db.collection('submissions').doc(submissionId).update({
          locationOnChain: {
            txHash: tx.transactionHash,
            blockNumber: tx.blockNumber,
            latE7,
            lngE7
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (onchainError) {
      console.warn('On-chain location recording failed (continuing):', onchainError.message);
    }

    // Trigger AI verification
    if (images.length > 0) {
      setTimeout(async () => {
        await verifySubmissionWithAI(submissionId, images[0].url);
      }, 2000);
    }

    res.status(201).json({ 
      success: true, 
      data: {
        submissionId,
        status: 'pending',
        estimatedCredits,
        message: 'Submission created successfully'
      }
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ 
      error: 'Failed to create submission',
      message: error.message 
    });
  }
});

// Get user's submissions (Android-optimized)
router.get('/user/:userId/submissions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db.collection('submissions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.limit(parseInt(limit)).offset(offset).get();
    const submissions = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        type: data.type,
        status: data.status,
        area: data.area,
        estimatedCredits: data.estimatedCredits,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        images: data.images || [],
        location: data.location,
        aiVerification: data.aiVerification
      });
    });

    // Get total count
    const totalSnapshot = await db.collection('submissions')
      .where('userId', '==', userId)
      .get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch submissions',
      message: error.message 
    });
  }
});

// Get user profile (Android-optimized)
router.get('/user/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Get user's credit summary
    const creditsSnapshot = await db.collection('carbonCredits')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();
    
    let totalCredits = 0;
    creditsSnapshot.forEach(doc => {
      totalCredits += doc.data().amount;
    });

    // Get submission counts
    const submissionsSnapshot = await db.collection('submissions')
      .where('userId', '==', userId)
      .get();
    
    const totalSubmissions = submissionsSnapshot.size;
    const verifiedSubmissions = submissionsSnapshot.docs.filter(
      doc => doc.data().status === 'approved'
    ).length;

    const profile = {
      userId,
      name: userData.name || 'Unknown',
      email: userData.email || '',
      totalCredits,
      totalSubmissions,
      verifiedSubmissions,
      joinDate: userData.joinDate?.toDate?.()?.toISOString(),
      status: userData.status || 'active',
      walletAddress: userData.walletAddress || ''
    };

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      message: error.message 
    });
  }
});

// Get user's carbon credits (Android-optimized)
router.get('/user/:userId/credits', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const snapshot = await db.collection('carbonCredits')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(offset)
      .get();

    const credits = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      credits.push({
        id: doc.id,
        amount: data.amount,
        type: data.type,
        status: data.status,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        blockchainTx: data.blockchainTx
      });
    });

    // Get total count
    const totalSnapshot = await db.collection('carbonCredits')
      .where('userId', '==', userId)
      .get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: credits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    res.status(500).json({ 
      error: 'Failed to fetch credits',
      message: error.message 
    });
  }
});

// AI verification function
async function verifySubmissionWithAI(submissionId, imageUrl) {
  try {
    // This would call your AI service
    // For now, we'll simulate the response
    const aiResponse = {
      result: Math.random() > 0.3 ? 'verified' : 'rejected',
      confidence: Math.random() * 0.4 + 0.6,
      processingTime: Math.random() * 2 + 1
    };

    await db.collection('submissions').doc(submissionId).update({
      'aiVerification.result': aiResponse.result,
      'aiVerification.confidence': aiResponse.confidence,
      'aiVerification.processingTime': aiResponse.processingTime,
      'aiVerification.timestamp': admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`AI verification completed for submission ${submissionId}:`, aiResponse);
  } catch (error) {
    console.error('Error in AI verification:', error);
  }
}

module.exports = router;


