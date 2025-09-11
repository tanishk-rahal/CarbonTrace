# CarbonTrace Production Deployment Guide

## 🚀 Complete Production Setup

### Phase 1: Backend Deployment

#### 1.1 Server Setup (AWS/GCP/Azure)
```bash
# Create EC2 instance (AWS) or VM (GCP/Azure)
# Recommended specs:
# - 2 vCPUs, 4GB RAM (minimum)
# - 20GB SSD storage
# - Ubuntu 20.04 LTS

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt update
sudo apt install nginx

# Install Docker (optional, for containerized deployment)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 1.2 Application Deployment
```bash
# Clone repository
git clone <your-repo-url>
cd carbontrace-admin

# Install dependencies
cd backend
npm install --production

# Set up environment
cp env.example .env
# Edit .env with production values

# Start with PM2
pm2 start src/server.js --name "carbontrace-api"
pm2 save
pm2 startup
```

#### 1.3 Nginx Configuration
```nginx
# /etc/nginx/sites-available/carbontrace
server {
    listen 80;
    server_name your-domain.com;

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend static files
    location / {
        root /var/www/carbontrace-admin/build;
        try_files $uri $uri/ /index.html;
    }
}
```

### Phase 2: Frontend Deployment

#### 2.1 Build Production Version
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to server
rsync -avz build/ user@your-server:/var/www/carbontrace-admin/
```

#### 2.2 Environment Configuration
```env
# .env.production
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Phase 3: Database & Storage

#### 3.1 Firebase Production Setup
1. **Firestore Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Submissions are readable by authenticated users
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Carbon credits are readable by authenticated users
    match /carbonCredits/{creditId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

2. **Storage Security Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{submissionId}/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### 3.2 Database Indexes
Create these indexes in Firestore:
- `submissions` collection: `createdAt` (descending)
- `submissions` collection: `status` + `createdAt` (descending)
- `submissions` collection: `userId` + `createdAt` (descending)
- `carbonCredits` collection: `userId` + `createdAt` (descending)

### Phase 4: Blockchain Integration

#### 4.1 Smart Contract Deployment
```solidity
// Deploy to mainnet/testnet
// Update contract address in backend .env
CARBON_CREDIT_CONTRACT_ADDRESS=0x...
```

#### 4.2 Blockchain Monitoring
```javascript
// Set up event listeners for contract events
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

contract.events.CreditsIssued({
  fromBlock: 'latest'
}, (error, event) => {
  console.log('Credits issued:', event.returnValues);
  // Update database
});
```

### Phase 5: AI Service Deployment

#### 5.1 AI Service Setup
```python
# ai-service/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import cv2
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML models
model = tf.keras.models.load_model('models/plantation_verification.h5')

@app.post("/verify-image")
async def verify_image(data: dict):
    # Image verification logic
    pass

@app.post("/calculate-credits")
async def calculate_credits(data: dict):
    # Credit calculation logic
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 5.2 Deploy AI Service
```bash
# Using Docker
docker build -t carbontrace-ai .
docker run -p 8000:8000 carbontrace-ai

# Or with PM2
pm2 start "python main.py" --name "carbontrace-ai"
```

### Phase 6: Mobile App Integration

#### 6.1 Mobile App Configuration
```javascript
// mobile/src/config/api.js
const API_BASE_URL = 'https://your-domain.com/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
};
```

#### 6.2 App Store Deployment
1. Build production APK/IPA
2. Test on multiple devices
3. Submit to Google Play Store / Apple App Store
4. Set up crash reporting (Firebase Crashlytics)

### Phase 7: Monitoring & Security

#### 7.1 Monitoring Setup
```javascript
// backend/src/middleware/monitoring.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Set up alerts for:
// - High error rates
// - Slow response times
// - Database connection issues
// - Blockchain transaction failures
```

#### 7.2 Security Measures
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// CORS configuration
app.use(cors({
  origin: ['https://your-domain.com', 'https://admin.your-domain.com'],
  credentials: true
}));

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Phase 8: CI/CD Pipeline

#### 8.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/carbontrace-admin
          git pull origin main
          cd backend
          npm install --production
          pm2 restart carbontrace-api
          cd ../frontend
          npm run build
```

### Phase 9: Testing & Validation

#### 9.1 Load Testing
```bash
# Using Artillery
npm install -g artillery

# Create load test
artillery quick --count 100 --num 10 http://your-domain.com/api/health
```

#### 9.2 Security Testing
```bash
# OWASP ZAP security scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://your-domain.com
```

### Phase 10: Go Live Checklist

- [ ] Backend API deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Firebase database configured with security rules
- [ ] Blockchain smart contracts deployed
- [ ] AI service running and accessible
- [ ] Mobile app published to app stores
- [ ] SSL certificates installed
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Documentation updated
- [ ] Team trained on production system

## 🎯 Success Metrics

- **Uptime**: 99.9%
- **Response Time**: < 2 seconds
- **Error Rate**: < 1%
- **Security**: Pass OWASP security scan
- **Scalability**: Handle 10,000+ concurrent users

## 📞 Support & Maintenance

- Set up monitoring alerts
- Regular security updates
- Database backups
- Performance optimization
- User feedback collection
- Bug tracking and resolution

Your CarbonTrace platform is now production-ready! 🚀





