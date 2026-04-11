#!/bin/bash

# 🚀 Backend Integration & Deployment Verification Script
# This script checks if your Uber clone is ready for deployment
# Run: bash verify-deployment.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Uber Clone - Backend Integration & Deployment Check   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

check_status=0

# ============================================================
# 1. Check Documentation
# ============================================================
echo "📚 1. Checking Documentation..."

required_docs=(
  "README.md"
  "QUICK_START.md"
  "FEATURES_COMPLETE.md"
  "DEPLOYMENT_CHECKLIST.md"
  "PROJECT_COMPLETION_REPORT.md"
  "BACKEND_INTEGRATION_DEPLOYMENT.md"
  "LOCAL_AND_DOCKER_QUICKSTART.md"
  "BACKEND_INTEGRATION_SUMMARY.md"
  "INTEGRATION_STATUS.md"
  "DOCUMENTATION_INDEX.md"
)

for doc in "${required_docs[@]}"; do
  if [ -f "$doc" ]; then
    echo "   ✅ $doc"
  else
    echo "   ❌ $doc - MISSING"
    check_status=1
  fi
done

echo ""

# ============================================================
# 2. Check Backend Structure
# ============================================================
echo "🔧 2. Checking Backend Structure..."

backend_files=(
  "Backend/.env.example"
  "Backend/Dockerfile"
  "Backend/.dockerignore"
  "Backend/app.js"
  "Backend/server.js"
  "Backend/package.json"
  "Backend/controllers/user.controller.js"
  "Backend/controllers/captain.controller.js"
  "Backend/models/user.model.js"
  "Backend/models/captain.model.js"
  "Backend/routes/user.routes.js"
  "Backend/routes/captain.routes.js"
  "Backend/middlewares/auth.middleware.js"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file - MISSING"
    check_status=1
  fi
done

echo ""

# ============================================================
# 3. Check Frontend Structure
# ============================================================
echo "⚛️  3. Checking Frontend Structure..."

frontend_files=(
  "frontend/.env.example"
  "frontend/Dockerfile"
  "frontend/.dockerignore"
  "frontend/nginx.conf"
  "frontend/package.json"
  "frontend/vite.config.js"
  "frontend/src/services/api.js"
  "frontend/src/services/API_INTEGRATION_EXAMPLES.jsx"
  "frontend/src/App.jsx"
  "frontend/src/main.jsx"
  "frontend/src/pages/Start.jsx"
  "frontend/src/pages/Home.jsx"
  "frontend/src/pages/CaptainHome.jsx"
  "frontend/src/pages/UserLogin.jsx"
  "frontend/src/pages/CaptainLogin.jsx"
)

for file in "${frontend_files[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file - MISSING"
    check_status=1
  fi
done

echo ""

# ============================================================
# 4. Check Docker Configuration
# ============================================================
echo "🐳 4. Checking Docker Configuration..."

docker_files=(
  "docker-compose.yml"
  "Backend/Dockerfile"
  "frontend/Dockerfile"
  "frontend/nginx.conf"
)

for file in "${docker_files[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file - MISSING"
    check_status=1
  fi
done

echo ""

# ============================================================
# 5. Check CI/CD Configuration
# ============================================================
echo "🔄 5. Checking CI/CD Configuration..."

if [ -d ".github/workflows" ]; then
  echo "   ✅ .github/workflows directory exists"
  if [ -f ".github/workflows/backend.yml" ]; then
    echo "   ✅ .github/workflows/backend.yml"
  else
    echo "   ❌ .github/workflows/backend.yml - MISSING"
    check_status=1
  fi
  if [ -f ".github/workflows/frontend.yml" ]; then
    echo "   ✅ .github/workflows/frontend.yml"
  else
    echo "   ❌ .github/workflows/frontend.yml - MISSING"
    check_status=1
  fi
else
  echo "   ❌ .github/workflows directory - MISSING"
  check_status=1
fi

echo ""

# ============================================================
# 6. Check Dependencies
# ============================================================
echo "📦 6. Checking Dependencies..."

# Check Node.js
if command -v node &> /dev/null; then
  node_version=$(node --version)
  echo "   ✅ Node.js installed: $node_version"
else
  echo "   ⚠️  Node.js not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
  npm_version=$(npm --version)
  echo "   ✅ npm installed: $npm_version"
else
  echo "   ⚠️  npm not installed"
fi

# Check MongoDB (optional)
if command -v mongosh &> /dev/null; then
  echo "   ✅ MongoDB CLI installed"
else
  echo "   ⚠️  MongoDB not installed (required for local dev)"
fi

# Check Docker (optional but recommended)
if command -v docker &> /dev/null; then
  docker_version=$(docker --version)
  echo "   ✅ Docker installed: $docker_version"
else
  echo "   ⚠️  Docker not installed (use for containerized deployment)"
fi

# Check Docker Compose (optional but recommended)
if command -v docker-compose &> /dev/null; then
  docker_compose_version=$(docker-compose --version)
  echo "   ✅ Docker Compose installed: $docker_compose_version"
else
  echo "   ⚠️  Docker Compose not installed"
fi

echo ""

# ============================================================
# 7. Check Environment Files
# ============================================================
echo "🔐 7. Checking Environment Files..."

if [ -f "Backend/.env" ]; then
  echo "   ✅ Backend/.env exists"
else
  echo "   ⚠️  Backend/.env not found (create from .env.example)"
fi

if [ -f "frontend/.env" ]; then
  echo "   ✅ frontend/.env exists"
else
  echo "   ⚠️  frontend/.env not found (create from .env.example)"
fi

echo ""

# ============================================================
# 8. Summary
# ============================================================
echo "═══════════════════════════════════════════════════════════"

if [ $check_status -eq 0 ]; then
  echo ""
  echo "✅ ALL CHECKS PASSED!"
  echo ""
  echo "Your Uber Clone is ready for deployment!"
  echo ""
  echo "🚀 Quick Start Options:"
  echo ""
  echo "Option 1: Run Locally (5 minutes)"
  echo "  cd Backend && npm install && npm run dev"
  echo "  cd frontend && npm install && npm run dev"
  echo ""
  echo "Option 2: Run with Docker (3 minutes)"
  echo "  docker-compose up -d"
  echo ""
  echo "Option 3: Deploy to Production"
  echo "  See BACKEND_INTEGRATION_DEPLOYMENT.md for detailed steps"
  echo ""
  echo "📚 Documentation:"
  echo "  • Start with: DOCUMENTATION_INDEX.md"
  echo "  • Quick setup: LOCAL_AND_DOCKER_QUICKSTART.md"
  echo "  • Deployment: BACKEND_INTEGRATION_DEPLOYMENT.md"
  echo ""
else
  echo ""
  echo "❌ SOME CHECKS FAILED"
  echo ""
  echo "Please review the missing files above and ensure all files are present."
  echo "Run this script from the project root directory."
  echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo ""

exit $check_status
