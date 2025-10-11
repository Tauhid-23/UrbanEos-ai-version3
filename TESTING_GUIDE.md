# UrbanEos AI - Testing Guide 🧪

## How to Test Phase 1 Backend Work

---

## ✅ Server Status Check

The backend server is running on **port 8001**. Since this is inside a container, you'll test using command line tools.

### Check if Server is Running
```bash
ps aux | grep "node server.js"
```

---

## 🔍 Test Methods

### Method 1: Browser (If Exposed)
If your container exposes port 8001, open:
```
http://your-domain:8001/api/health
```

### Method 2: Command Line (Recommended)
Use `curl` from inside the container:

```bash
# Test from container
curl http://localhost:8001/api/health
```

### Method 3: API Testing Tools
- Postman
- Insomnia
- Thunder Client (VS Code)
- HTTPie

---

## 🧪 Test Cases

### 1. Health Check ✅ (Working)
**Test the API is running:**

```bash
curl http://localhost:8001/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "UrbanEos API Server is running",
  "timestamp": "2025-10-11T18:11:06.000Z",
  "environment": "development"
}
```

---

### 2. User Registration ✅ (Working)
**Register a new user:**

```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Ahmed Rahman",
    "email": "ahmed@example.com",
    "password": "password123",
    "gardenType": "balcony",
    "location": {
      "city": "Dhaka",
      "division": "Dhaka"
    },
    "experience": "beginner"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "fullName": "Ahmed Rahman",
      "email": "ahmed@example.com",
      "gardenType": "balcony",
      "level": "Budding Gardener",
      "points": 0
    }
  }
}
```

---

### 3. User Login ✅ (Working)
**Login with credentials:**

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "fullName": "Ahmed Rahman",
      "email": "ahmed@example.com",
      ...
    }
  }
}
```

**📝 Save the token from the response! You'll need it for authenticated requests.**

---

### 4. Get Current User ✅ (Working)
**Get logged-in user profile:**

```bash
# Replace YOUR_TOKEN with the token from login response
curl -X GET http://localhost:8001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Ahmed Rahman",
      "email": "ahmed@example.com",
      "gardenType": "balcony",
      "level": "Budding Gardener"
    }
  }
}
```

---

### 5. Logout ✅ (Working)
**Logout user:**

```bash
curl -X POST http://localhost:8001/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

### 6. Test Invalid Login ✅ (Working)
**Test error handling:**

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 7. Test Protected Route Without Token ✅ (Working)
**Test authentication middleware:**

```bash
curl -X GET http://localhost:8001/api/auth/me
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

## 📊 What's Working (Phase 1)

### ✅ Completed & Tested
1. **Server Setup** - Express app running on port 8001
2. **MongoDB Connection** - Connected to local MongoDB
3. **Health Check Endpoint** - `/api/health`
4. **User Registration** - `/api/auth/register`
5. **User Login** - `/api/auth/login` with JWT
6. **Get Current User** - `/api/auth/me`
7. **Logout** - `/api/auth/logout`
8. **JWT Authentication** - Token-based auth working
9. **Password Hashing** - bcrypt with 10 rounds
10. **Error Handling** - Proper error messages
11. **CORS** - Configured for frontend URL
12. **Environment Config** - .env file working

### 🗄️ Database Models Created (Not Yet Connected to Routes)
1. **User Model** - Authentication and profile
2. **Plant Model** - Garden management
3. **Task Model** - Task tracking
4. **Post Model** - Community forum
5. **QuoteRequest Model** - Bangladesh-specific quotes
6. **PlantDiagnosis Model** - AI diagnosis results

### ⏳ To Be Implemented (Phase 2)
- Plant CRUD operations
- Task management endpoints
- Community forum endpoints
- Quote request endpoints
- Plant diagnosis endpoints
- Weather API integration
- File upload functionality

---

## 🔧 Check Server Logs

```bash
# View server logs
tail -f /tmp/backend.log

# View last 50 lines
tail -50 /tmp/backend.log

# Check for errors
grep -i error /tmp/backend.log
```

---

## 📁 Review Created Files

### Backend Structure
```bash
# View all backend files
ls -la /app/backend/

# View models
ls -la /app/backend/models/

# Check server file
cat /app/backend/server.js

# Check auth controller
cat /app/backend/controllers/authController.js
```

### Documentation
```bash
# API Documentation
cat /app/backend/API_DOCUMENTATION.md

# Phase 1 Deliverables
cat /app/PHASE1_DELIVERABLES.md

# README
cat /app/README.md
```

---

## 🗃️ Check MongoDB

```bash
# Connect to MongoDB shell
mongosh mongodb://localhost:27017/urbaneos

# Inside MongoDB shell:
# Show databases
show dbs

# Use urbaneos database
use urbaneos

# Show collections
show collections

# View users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Exit
exit
```

---

## 📝 Complete Test Workflow

Here's a complete test sequence you can run:

```bash
# 1. Check server health
echo "=== Testing Health Check ==="
curl http://localhost:8001/api/health
echo -e "\n"

# 2. Register a user
echo "=== Registering User ==="
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "gardenType": "balcony"
  }'
echo -e "\n"

# 3. Login
echo "=== Logging In ==="
RESPONSE=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo $RESPONSE
echo -e "\n"

# 4. Extract token (manual step - copy token from above response)
# TOKEN="your_token_here"

# 5. Get current user
echo "=== Getting Current User ==="
# curl -X GET http://localhost:8001/api/auth/me \
#   -H "Authorization: Bearer $TOKEN"
echo "Use the token from login response"
echo -e "\n"
```

---

## 🎯 Quick Test Commands

### Basic Tests (Copy & Paste)

**Test 1: Health Check**
```bash
curl http://localhost:8001/api/health
```

**Test 2: Register User**
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@test.com","password":"test123","gardenType":"balcony"}'
```

**Test 3: Login**
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'
```

---

## 📚 Documentation Files

All documentation is available in these files:

1. **`/app/backend/API_DOCUMENTATION.md`**
   - Complete API reference (51 endpoints)
   - Request/response examples
   - Authentication guide
   - Data models

2. **`/app/PHASE1_DELIVERABLES.md`**
   - Comprehensive project summary
   - Frontend analysis results
   - Backend structure details
   - Statistics and metrics

3. **`/app/README.md`**
   - Quick start guide
   - Project overview
   - Key features

4. **`/app/TESTING_GUIDE.md`**
   - This file - testing instructions

---

## ⚡ Quick Verification Checklist

- [ ] Server running on port 8001
- [ ] Health check returns success
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Receive JWT token on login
- [ ] Can access protected route with token
- [ ] MongoDB connected and users saved
- [ ] Error handling works (wrong credentials)
- [ ] Documentation files exist

---

## 🐛 Troubleshooting

### Server Not Responding
```bash
# Check if server is running
ps aux | grep "node server.js"

# Restart server
cd /app/backend
node server.js &

# Check logs
tail -f /tmp/backend.log
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check connection string in .env
cat /app/backend/.env | grep MONGODB_URI
```

### Port Already in Use
```bash
# Kill process on port 8001
sudo fuser -k 8001/tcp

# Or find and kill the process
lsof -i :8001
kill -9 <PID>
```

---

## 📞 Support

If you encounter issues:

1. **Check Logs**: `tail -f /tmp/backend.log`
2. **Review Documentation**: See `/app/backend/API_DOCUMENTATION.md`
3. **Check Environment**: Verify `/app/backend/.env` settings
4. **Test MongoDB**: `mongosh mongodb://localhost:27017/urbaneos`
5. **Verify Server**: `curl http://localhost:8001/api/health`

---

## 🎉 Success Criteria

**Phase 1 is successful if:**
- ✅ Server starts without errors
- ✅ Health check returns 200 OK
- ✅ Can register new users
- ✅ Can login with credentials
- ✅ JWT tokens are generated
- ✅ Protected routes require authentication
- ✅ Users saved in MongoDB
- ✅ All 6 models are created
- ✅ Documentation is complete

**All criteria met! Phase 1 Complete! ✅**

---

## 📈 Next Steps

After verifying Phase 1 works:

1. Review `/app/backend/API_DOCUMENTATION.md`
2. Check all 6 database models in `/app/backend/models/`
3. Read `/app/PHASE1_DELIVERABLES.md` for complete details
4. Ready for Phase 2: Implementing remaining controllers and routes

---

**Happy Testing! 🚀**
