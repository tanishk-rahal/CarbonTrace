# CarbonTrace Backend Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Firebase project with Firestore enabled
- Blockchain wallet with admin private key
- Git

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Enable Authentication
5. Enable Storage
6. Go to Project Settings > Service Accounts
7. Generate new private key and download JSON file
8. Rename it to `serviceAccountKey.json` and place in `backend/` folder

### 3. Environment Configuration
1. Copy `env.example` to `.env`
2. Fill in your Firebase configuration:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
# ... other Firebase config from serviceAccountKey.json
```

3. Add blockchain configuration:
```env
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CARBON_CREDIT_CONTRACT_ADDRESS=0x...
ADMIN_PRIVATE_KEY=0x...
```

### 4. Start Backend Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### 5. Test API
```bash
curl http://localhost:3001/api/health
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Submissions
- `GET /api/submissions` - List all submissions
- `GET /api/submissions/:id` - Get single submission
- `POST /api/submissions` - Create new submission
- `POST /api/submissions/:id/approve` - Approve submission
- `POST /api/submissions/:id/reject` - Reject submission

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/chart` - Get chart data
- `GET /api/dashboard/map` - Get map data

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user

### Blockchain
- `POST /api/blockchain/issue-credits` - Issue carbon credits
- `GET /api/blockchain/balance/:address` - Get wallet balance

## Database Schema

### Collections Structure
```
users/
  - uid: string
  - email: string
  - name: string
  - walletAddress: string
  - totalCredits: number
  - status: 'active' | 'suspended'

submissions/
  - id: string
  - userId: string
  - type: 'mangrove' | 'seagrass' | 'coral'
  - location: { lat: number, lng: number }
  - images: string[]
  - status: 'pending' | 'approved' | 'rejected'
  - estimatedCredits: number

carbonCredits/
  - id: string
  - userId: string
  - submissionId: string
  - amount: number
  - status: 'active' | 'retired'
  - blockchainTx: string
```

## Frontend Integration

Update your React app's `.env` file:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check serviceAccountKey.json is in correct location
   - Verify Firebase project ID matches

2. **Blockchain Connection Error**
   - Verify RPC URL is correct
   - Check admin private key format (should start with 0x)

3. **CORS Error**
   - Update FRONTEND_URL in .env file
   - Check if frontend is running on correct port

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill process using port 3001

### Logs
Check console output for detailed error messages. All API calls are logged with timestamps.

## Next Steps

1. Set up AI service for image verification
2. Configure production deployment
3. Set up monitoring and logging
4. Implement authentication middleware
5. Add rate limiting and security measures

