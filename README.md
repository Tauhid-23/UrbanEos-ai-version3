# UrbanEos AI - Smart Urban Gardening Platform 🌱

A comprehensive AI-powered platform for urban gardening in Bangladesh, helping users grow fresh vegetables and herbs in balconies and rooftops.

---

## 🚀 Quick Start

### Backend Server
```bash
cd /app/backend
node server.js
# Server: http://localhost:8001
# Health Check: http://localhost:8001/api/health
```

### Frontend Application
```bash
cd /app/frontend  
yarn start
# App: http://localhost:3000
```

---

## 📚 Documentation

- **[API Documentation](./backend/API_DOCUMENTATION.md)** - Complete API reference (51 endpoints)
- **[Phase 1 Deliverables](./PHASE1_DELIVERABLES.md)** - Comprehensive project summary
- **[Environment Setup](./ backend/.env.example)** - Configuration template

---

## ✅ Phase 1 Status: COMPLETE

### What's Implemented
- ✅ Frontend Analysis (17 pages, all mock data identified)
- ✅ Backend Structure (Node.js/Express/MongoDB)
- ✅ 6 Database Models (User, Plant, Task, Post, QuoteRequest, PlantDiagnosis)
- ✅ Authentication System (JWT with bcrypt)
- ✅ 51 API Endpoints Identified
- ✅ Helper Functions & Middleware
- ✅ Comprehensive Documentation

### Server Running
```bash
🚀 UrbanEos API Server Started!
📡 Server running on http://0.0.0.0:8001
✅ MongoDB Connected: localhost
📦 Database Name: urbaneos
```

---

## 🏗️ Technology Stack

**Backend:** Node.js, Express.js, MongoDB, JWT  
**Frontend:** React 18, Tailwind CSS, Lucide Icons  
**Database:** MongoDB (Mongoose ODM)  
**Authentication:** JWT + bcrypt

---

## 📦 Project Structure

```
/app/
├── backend/                    # Node.js/Express API
│   ├── models/                # 6 Mongoose models ✅
│   ├── controllers/           # authController ✅
│   ├── middleware/            # JWT auth ✅
│   ├── config/                # Database config ✅
│   ├── utils/                 # Helpers ✅
│   ├── server.js              # Main server ✅
│   └── .env                   # Environment vars ✅
├── frontend/                  # React application
│   └── src/pages/            # 17 pages analyzed ✅
├── API_DOCUMENTATION.md       # Complete API docs ✅
└── PHASE1_DELIVERABLES.md     # Project summary ✅
```

---

## 🔗 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user ✅

### Plants
- `GET /api/plants` - Get user's plants
- `POST /api/plants` - Add new plant
- `PUT /api/plants/:id` - Update plant

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id/complete` - Complete task

### Community
- `GET /api/community/posts` - Get posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/like` - Like post

### Quotes
- `POST /api/quotes/request` - Submit quote request
- `GET /api/quotes` - Get user's quotes

**Total: 51 endpoints** | See [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🧪 Test the API

```bash
# Health Check
curl http://localhost:8001/api/health

# Expected Response:
{
  "success": true,
  "message": "UrbanEos API Server is running",
  "timestamp": "2025-01-...",
  "environment": "development"
}
```

---

## 🇧🇩 Bangladesh Features

- **8 Divisions**: Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh
- **Phone Validation**: Supports +880, 880, 0 prefixes
- **Weather Data**: Localized for Bangladesh cities
- **Plant Database**: Optimized for Bangladesh climate

---

## 📊 Database Models

1. **User** - Auth, profile, location, level system
2. **Plant** - Health tracking, care schedule, notes
3. **Task** - Priorities, reminders, recurring tasks
4. **Post** - Community forum with likes/replies
5. **QuoteRequest** - Supply requests with Bangladesh fields
6. **PlantDiagnosis** - AI diagnosis with confidence scores

---

## 🔐 Authentication

JWT-based authentication with bcrypt password hashing.

```bash
# Register
POST /api/auth/register
{ "fullName": "Test User", "email": "test@example.com", "password": "password123" }

# Login
POST /api/auth/login
{ "email": "test@example.com", "password": "password123" }

# Protected Routes
Authorization: Bearer <token>
```

---

## 📈 Next Steps (Phase 2)

1. Complete remaining controllers
2. Implement all route files
3. Integrate Plant.id API (plant identification)
4. Integrate OpenWeather API (weather data)
5. Setup file upload (multer)
6. Test all endpoints
7. Connect frontend to backend

---

## 📞 Support

- **API Docs**: [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
- **Deliverables**: [PHASE1_DELIVERABLES.md](./PHASE1_DELIVERABLES.md)
- **Logs**: `tail -f /tmp/backend.log`
- **MongoDB**: `mongodb://localhost:27017/urbaneos`

---

## 🎯 Statistics

- **Files Created**: 13 files
- **Lines of Code**: 3,000+ lines
- **API Endpoints**: 51 endpoints identified
- **Models**: 6 database models
- **Dependencies**: 12 packages
- **Phase 1 Complete**: 100% ✅

---

**Built with ❤️ for urban gardeners in Bangladesh**

For complete details, see [PHASE1_DELIVERABLES.md](./PHASE1_DELIVERABLES.md)
