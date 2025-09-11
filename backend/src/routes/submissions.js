const express = require('express');
const { admin, db } = require('../config/firebase');
const { web3, carbonCreditContract, adminWallet } = require('../config/blockchain');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all submissions with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    let query = db.collection('submissions').orderBy('createdAt', 'desc');

    // Apply filters
    if (status) query = query.where('status', '==', status);
    if (type) query = query.where('type', '==', type);

    const snapshot = await query.limit(parseInt(limit)).offset(offset).get();
    const submissions = [];

    snapshot.forEach(doc => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
      });
    });

    // Get total count for pagination
    const totalSnapshot = await db.collection('submissions').get();
    const total = totalSnapshot.size;

    res.json({
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get single submission
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('submissions').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submission = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
    };

    res.json({ data: submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Create new submission (from mobile app)
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { userId, type, location, area, description } = req.body;
    
    if (!userId || !type || !location || !area) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const submissionId = uuidv4();
    const images = [];

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageId = uuidv4();
        const processedImage = await sharp(file.buffer)
          .resize(800, 600, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload to Firebase Storage
        const bucket = admin.storage().bucket();
        const fileUpload = bucket.file(`submissions/${submissionId}/${imageId}.jpg`);
        
        await fileUpload.save(processedImage, {
          metadata: {
            contentType: 'image/jpeg',
            metadata: {
              submissionId,
              userId,
              type
            }
          }
        });

        images.push({
          id: imageId,
          url: `https://storage.googleapis.com/${bucket.name}/submissions/${submissionId}/${imageId}.jpg`,
          thumbnail: `https://storage.googleapis.com/${bucket.name}/submissions/${submissionId}/${imageId}_thumb.jpg`
        });
      }
    }

    // Calculate estimated credits based on area and type
    const creditMultiplier = {
      mangrove: 150,
      seagrass: 100,
      coral: 200
    };
    const estimatedCredits = Math.floor(area * creditMultiplier[type] || 100);

    const submission = {
      id: submissionId,
      userId,
      type,
      location: JSON.parse(location),
      area: parseFloat(area),
      description: description || '',
      images,
      estimatedCredits,
      status: 'pending',
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
      if (process.env.ENABLE_ONCHAIN_LOCATION === 'true' && submission.location?.lat && submission.location?.lng) {
        const latE7 = Math.round(parseFloat(submission.location.lat) * 1e7);
        const lngE7 = Math.round(parseFloat(submission.location.lng) * 1e7);
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
      // This would typically be done via a queue or webhook
      // For now, we'll simulate it
      setTimeout(async () => {
        await verifySubmissionWithAI(submissionId, images[0].url);
      }, 2000);
    }

    res.status(201).json({ 
      success: true, 
      data: submission,
      message: 'Submission created successfully' 
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Approve submission and issue credits
router.post('/:id/approve', async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submissionRef = db.collection('submissions').doc(submissionId);
    
    const submission = await submissionRef.get();
    if (!submission.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submissionData = submission.data();
    if (submissionData.status !== 'pending') {
      return res.status(400).json({ error: 'Submission is not pending' });
    }

    // Get user's wallet address
    const userDoc = await db.collection('users').doc(submissionData.userId).get();
    const userData = userDoc.data();
    
    if (!userData.walletAddress) {
      return res.status(400).json({ error: 'User wallet address not found' });
    }

    // Issue credits on blockchain
    const tx = await carbonCreditContract.methods.issueCredits(
      userData.walletAddress,
      submissionData.estimatedCredits,
      submissionId
    ).send({
      from: adminWallet.address,
      gas: 200000
    });

    // Update submission status
    await submissionRef.update({
      status: 'approved',
      blockchainTx: {
        hash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        gasUsed: tx.gasUsed
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create carbon credit record
    await db.collection('carbonCredits').add({
      userId: submissionData.userId,
      submissionId,
      amount: submissionData.estimatedCredits,
      type: submissionData.type,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockchainTx: tx.transactionHash
    });

    // Update user's total credits
    await db.collection('users').doc(submissionData.userId).update({
      totalCredits: admin.firestore.FieldValue.increment(submissionData.estimatedCredits),
      verifiedSubmissions: admin.firestore.FieldValue.increment(1)
    });

    res.json({
      success: true,
      message: 'Submission approved and credits issued',
      transactionHash: tx.transactionHash,
      creditsIssued: submissionData.estimatedCredits
    });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({ error: 'Failed to approve submission' });
  }
});

// Reject submission
router.post('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const submissionId = req.params.id;
    
    await db.collection('submissions').doc(submissionId).update({
      status: 'rejected',
      rejectionReason: reason || 'Submission did not meet verification criteria',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Submission rejected'
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ error: 'Failed to reject submission' });
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

