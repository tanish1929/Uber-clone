# 🚀 Quick Start Guide - Backend & Deployment

## Option 1: Run Locally (Development)

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm/yarn

### Backend Setup

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env - Update these values:
# DB_CONNECT = your MongoDB connection string
# JWT_SECRET = any random string (will use default if not set)

# Start backend
npm run dev

# Backend runs on http://localhost:4000
```

### Frontend Setup (In another terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default VITE_API_BASE_URL is already set to http://localhost:4000

# Start frontend
npm run dev

# Frontend runs on http://localhost:5173
```

### Test It

1. Open browser: http://localhost:5173
2. Click "Sign Up as Rider"
3. Fill form and submit
4. Check backend console - should see "Connected to MongoDB"
5. Check browser DevTools Network tab - request to /users/register

---

## Option 2: Run with Docker (Recommended for Production)

### Prerequisites
- Docker installed (https://www.docker.com)
- Docker Compose installed

### Quick Start

```bash
# From project root directory

# Copy environment variables
cp Backend/.env.example Backend/.env
cp frontend/.env.example frontend/.env

# Edit Backend/.env:
# - Set JWT_SECRET to something random
# - DB_CONNECT will auto-connect to MongoDB container

# Start all services
docker-compose up -d

# Wait 30 seconds for services to start

# Check if running
docker-compose ps

# View logs
docker-compose logs -f

# Access services:
# Frontend: http://localhost (port 80)
# Backend API: http://localhost:4000
# MongoDB: mongodb://admin:password123@localhost:27017
```

### Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

---

## Environment Variables Reference

### Backend (.env)

```bash
PORT=4000
NODE_ENV=development
DB_CONNECT=mongodb://localhost:27017/uber_clone  # Local
# DB_CONNECT=mongodb+srv://user:pass@cluster.mongodb.net/uber_clone  # Atlas

JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Uber Clone
VITE_ENV=development
```

---

## MongoDB Connection

### Option A: Use Docker MongoDB (Easiest)
- Runs automatically when you run `docker-compose up`
- Connection: `mongodb://admin:password123@mongodb:27017/uber_clone?authSource=admin`
- Access with MongoDB Compass or mongosh

### Option B: MongoDB Local
```bash
# Start MongoDB service
mongod  # macOS/Linux
net start MongoDB  # Windows

# Edit Backend/.env:
DB_CONNECT=mongodb://localhost:27017/uber_clone
```

### Option C: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account → Create free cluster
3. Get connection string
4. Edit Backend/.env:
```bash
DB_CONNECT=mongodb+srv://username:password@cluster.mongodb.net/uber_clone?retryWrites=true&w=majority
```

---

## API Testing

### Test User Registration

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname": "John", "lastname": "Doe"},
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test User Login

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Protected Route

```bash
# Use token from login response
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. Verify credentials (especially for Atlas)
4. Check firewall isn't blocking port 27017

### Issue: "CORS error in browser"
**Solution:**
1. Check `CORS_ORIGIN` in Backend/.env matches frontend URL
2. For development: `CORS_ORIGIN=http://localhost:5173`
3. Restart backend after changing

### Issue: "Port 4000 already in use"
**Solution:**
```bash
# Find and kill process using port 4000
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: "Docker containers won't start"
**Solution:**
```bash
docker-compose down -v  # Remove everything
docker-compose build --no-cache  # Rebuild
docker-compose up  # Start fresh
```

---

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /users/register | - | Create user account |
| POST | /users/login | - | User login |
| GET | /users/profile | ✅ | Get user profile |
| GET | /users/logout | ✅ | Logout user |
| POST | /captains/register | - | Create captain account |
| POST | /captains/login | - | Captain login |
| GET | /captains/profile | ✅ | Get captain profile |
| GET | /captains/logout | ✅ | Logout captain |

---

## Production Deployment

### Vercel (Frontend - Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Inside frontend directory
cd frontend

# Deploy
vercel

# Set environment variable:
# VITE_API_BASE_URL = https://your-backend-url.com

# Deploy to production
vercel --prod
```

### Heroku (Backend)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create uber-clone-backend

# Set environment variables
heroku config:set JWT_SECRET="random_key"
heroku config:set DB_CONNECT="mongodb_atlas_url"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Monitoring

```bash
# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# View database logs
docker-compose logs -f mongodb

# Monitor resource usage
docker stats
```

---

## Development Workflow

1. **Start Services**
   ```bash
   docker-compose up -d
   ```

2. **Make Changes**
   - Edit code in frontend/src or Backend
   - HMR (Hot Module Replacement) will reload frontend
   - Nodemon will restart backend

3. **Test Changes**
   - Frontend: http://localhost:5173
   - API: curl http://localhost:4000

4. **Check Logs**
   ```bash
   docker-compose logs -f backend
   ```

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "Feature: your feature"
   git push
   ```

---

## Additional Resources

- [Backend Integration Guide](./BACKEND_INTEGRATION_DEPLOYMENT.md)
- [Project Completion Report](./PROJECT_COMPLETION_REPORT.md)
- [Features Documentation](./FEATURES_COMPLETE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

---

**Ready to start?** Choose your option above and run the commands! 🚀

For questions or issues, check the [Troubleshooting](#common-issues--solutions) section.
