# 🚀 Backend Integration & Deployment Guide

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Database Configuration](#database-configuration)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Local Deployment](#local-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Production Deployment](#production-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Backend Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# Update: DB_CONNECT, JWT_SECRET, CORS_ORIGIN
```

### Required Environment Variables

```bash
PORT=4000
NODE_ENV=development
DB_CONNECT=mongodb://your_connection_string
JWT_SECRET=your_secret_key_min_32_chars
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## Database Configuration

### Option 1: MongoDB Local

```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Verify connection
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `DB_CONNECT` in `.env`:

```
DB_CONNECT=mongodb+srv://username:password@cluster.mongodb.net/uber_clone?retryWrites=true&w=majority
```

## Initial Collections Setup

The backend will auto-create collections on first run through Mongoose schemas:
- `users` - User data
- `captains` - Captain/Driver data
- `blacklisttokens` - Logged out tokens
- `rides` - Ride records (to be added)

---

## API Endpoints

### User Endpoints

```
POST   /users/register          - Register new user
POST   /users/login             - User login
GET    /users/profile           - Get user profile (auth required)
GET    /users/logout            - Logout user (auth required)
PUT    /users/profile           - Update user profile (to be implemented)
```

### Captain Endpoints

```
POST   /captains/register       - Register new captain with vehicle
POST   /captains/login          - Captain login
GET    /captains/profile        - Get captain profile (auth required)
GET    /captains/logout         - Logout captain (auth required)
PUT    /captains/profile        - Update captain profile (to be implemented)
PUT    /captains/vehicle        - Update vehicle details (to be implemented)
```

### Request/Response Examples

#### Register User
```bash
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "user": { _id, fullname, email },
  "token": "jwt_token_here"
}
```

#### Register Captain
```bash
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "password123",
  "vehicle": {
    "color": "black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}

Response: {
  "captain": { _id, fullname, email, vehicle },
  "token": "jwt_token_here"
}
```

---

## Frontend Integration

### 1. Update API Base URL

Create `.env` file in frontend root:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

### 2. Use API Service

The frontend includes `src/services/api.js` for all API calls.

```javascript
import { api } from '../services/api';

// User login
const response = await api.user.login({
  email: 'user@example.com',
  password: 'password123'
});

// Captain profile
const profile = await api.captain.getProfile();

// Logout
await api.user.logout();
```

### 3. Token Management

Tokens are automatically stored:
- User token: `localStorage.token`
- Captain token: `localStorage.captainToken`

Tokens are automatically added to request headers via axios interceptor.

---

## Local Deployment

### Start Backend Dev Server

```bash
# Navigate to backend
cd Backend

# Start with nodemon (auto-reload)
npm run dev

# Or start directly
npm start

# Server runs on http://localhost:4000
```

### Start Frontend Dev Server

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# Frontend runs on http://localhost:5173
```

### Test Integration

1. Open frontend: http://localhost:5173
2. Navigate to signup
3. Register an account
4. Verify request in backend terminal
5. Check MongoDB for created user
6. Login to verify token generation

---

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Build and Run

```bash
# From project root directory

# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Verify Services

```bash
# Check running containers
docker ps

# Test backend
curl http://localhost:4000

# Access frontend
open http://localhost:80
```

### Common Docker Commands

```bash
# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild specific service
docker-compose build backend

# Remove all containers and volumes
docker-compose down -v

# Execute command in container
docker-compose exec backend npm run dev
```

---

## Production Deployment

### Option 1: Deploy to Heroku

#### Backend Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create uber-clone-backend

# Set environment variables
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set DB_CONNECT="your_mongodb_atlas_url"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Frontend Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Inside frontend directory
cd frontend

# Deploy
vercel

# Set environment variable during deployment
# VITE_API_BASE_URL = https://your-heroku-backend.herokuapp.com

# Deploy again with env vars
vercel --prod
```

### Option 2: Deploy to AWS

#### Backend - Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB app
eb init -p node.js16 uber-clone-backend

# Create environment
eb create uber-clone-backend-env

# Deploy
eb deploy

# Set environment variables
eb setenv JWT_SECRET="key" DB_CONNECT="url"
```

#### Frontend - CloudFront + S3

```bash
# Build frontend
npm run build

# Create S3 bucket
aws s3 mb s3://uber-clone-frontend

# Upload files
aws s3 sync dist/ s3://uber-clone-frontend/

# Create CloudFront distribution for CDN
# (Use AWS Console for this)
```

### Option 3: Deploy to DigitalOcean App Platform

```bash
# Install DO CLI
doctl auth init

# Create app from docker-compose
doctl apps create --spec docker-compose.yml

# Monitor deployment
doctl apps get <app_id> --format=spec
```

---

## Production Checklist

### Security
- [ ] Change all default credentials
- [ ] Set strong JWT_SECRET (32+ chars, random)
- [ ] Enable HTTPS/SSL
- [ ] Set proper CORS_ORIGIN (not *)
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Implement proper error handling (no stack traces)

### Performance
- [ ] Enable gzip compression
- [ ] Set up Redis caching
- [ ] Optimize database indexes
- [ ] Use CDN for static files
- [ ] Enable HTTP/2

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Add logging (Winston, Morgan)
- [ ] Monitor uptime (Uptime Robot)
- [ ] Set up alerts

### Database
- [ ] Enable MongoDB backup
- [ ] Enable replication
- [ ] Monitor database size
- [ ] Create maintenance schedule

---

## Monitoring & Maintenance

### View Server Logs

```bash
# Docker
docker-compose logs -f backend

# Heroku
heroku logs --tail

# DigitalOcean App Platform
doctl apps logs <app_id>
```

### Database Maintenance

```bash
# Backup MongoDB
mongodump --uri="mongodb://..." --out=./backup

# Restore MongoDB
mongorestore --uri="mongodb://..." ./backup
```

### Health Checks

```bash
# Test backend health
curl http://localhost:4000

# Test with authentication required endpoint
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/users/profile
```

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages safely
npm update

# Update to latest versions
npm install npm@latest -g
```

---

## Troubleshooting

### Backend Won't Start

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check port availability
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows
```

### MongoDB Connection Error

```bash
# Verify MongoDB is running
mongosh

# Check connection string:
# mongosh "mongodb+srv://username:password@cluster..."

# Verify credentials:
# Username, password, database name
```

### CORS Errors

- Verify `CORS_ORIGIN` in `.env` matches frontend URL
- Frontend and backend must be on same domain or CORS must be enabled

---

## Next Steps

1. ✅ Backend API endpoints implemented
2. ✅ Frontend API service created
3. ✅ Docker configuration ready
4. 📋 Add ride booking endpoints
5. 📋 Add payment integration
6. 📋 Add real-time location tracking
7. 📋 Add WebSocket for live updates

---

**Last Updated**: January 2024  
**Version**: 1.0.0
