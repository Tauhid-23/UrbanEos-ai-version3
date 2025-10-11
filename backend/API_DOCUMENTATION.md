# UrbanEos AI - Backend API Documentation

## Server Information
- **Base URL**: `http://localhost:8001/api`
- **Technology Stack**: Node.js + Express + MongoDB
- **Authentication**: JWT (JSON Web Tokens)

---

## Authentication Endpoints

### 1. Register User
- **POST** `/api/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "fullName": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "location": {
    "city": "string",
    "division": "string",
    "district": "string"
  },
  "gardenType": "string (balcony|rooftop|indoor|backyard)",
  "spaceSize": "string",
  "experience": "string (beginner|intermediate|expert)",
  "plants": ["string"]
}
```
- **Response**: `{ success, message, data: { token, user } }`

### 2. Login User
- **POST** `/api/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
- **Response**: `{ success, message, data: { token, user } }`

### 3. Get Current User
- **GET** `/api/auth/me`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message, data: { user } }`

### 4. Logout
- **POST** `/api/auth/logout`
- **Access**: Private
- **Response**: `{ success, message }`

### 5. Update Password
- **PUT** `/api/auth/update-password`
- **Access**: Private
- **Body**:
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)"
}
```
- **Response**: `{ success, message, data: { token } }`

---

## User Endpoints

### 1. Get User Profile
- **GET** `/api/users/profile`
- **Access**: Private

### 2. Update User Profile
- **PUT** `/api/users/profile`
- **Access**: Private
- **Body**: Any user fields to update

### 3. Delete User Account
- **DELETE** `/api/users/account`
- **Access**: Private

### 4. Get User Statistics
- **GET** `/api/users/stats`
- **Access**: Private

---

## Plants (My Garden) Endpoints

### 1. Get All User Plants
- **GET** `/api/plants`
- **Access**: Private
- **Query Params**: `?status=healthy&type=Herb&page=1&limit=10`
- **Response**: User's plants with pagination

### 2. Get Single Plant
- **GET** `/api/plants/:id`
- **Access**: Private

### 3. Add New Plant
- **POST** `/api/plants`
- **Access**: Private
- **Body**:
```json
{
  "name": "string (required)",
  "type": "string (Herb|Vegetable|Fruit|Flower|Other)",
  "variety": "string",
  "image": "string",
  "plantedDate": "date",
  "location": "string",
  "notes": "string"
}
```

### 4. Update Plant
- **PUT** `/api/plants/:id`
- **Access**: Private
- **Body**: Any plant fields to update

### 5. Delete Plant
- **DELETE** `/api/plants/:id`
- **Access**: Private

### 6. Add Plant Note
- **POST** `/api/plants/:id/notes`
- **Access**: Private
- **Body**:
```json
{
  "content": "string",
  "type": "observation|action|issue|harvest"
}
```

### 7. Log Harvest
- **POST** `/api/plants/:id/harvest`
- **Access**: Private
- **Body**:
```json
{
  "quantity": "number",
  "unit": "string",
  "quality": "string",
  "notes": "string"
}
```

---

## Plant Database Endpoints

### 1. Browse Plant Database
- **GET** `/api/plant-database`
- **Access**: Public
- **Query Params**: `?type=Vegetable&difficulty=Easy&search=tomato&page=1&limit=20`
- **Response**: List of plants with care information

### 2. Get Plant Details
- **GET** `/api/plant-database/:id`
- **Access**: Public

### 3. Search Plants
- **GET** `/api/plant-database/search`
- **Access**: Public
- **Query Params**: `?q=basil`

---

## Tasks Endpoints

### 1. Get All Tasks
- **GET** `/api/tasks`
- **Access**: Private
- **Query Params**: `?status=pending&priority=high&date=2025-01-15&page=1&limit=20`

### 2. Get Single Task
- **GET** `/api/tasks/:id`
- **Access**: Private

### 3. Create Task
- **POST** `/api/tasks`
- **Access**: Private
- **Body**:
```json
{
  "plantName": "string (required)",
  "plant": "ObjectId (optional)",
  "task": "string (required)",
  "taskType": "watering|fertilizing|pruning|pest-control|harvesting|other",
  "priority": "low|medium|high",
  "dueDate": "date (required)",
  "time": "Morning|Afternoon|Evening|Anytime",
  "notes": "string",
  "recurring": {
    "enabled": false,
    "frequency": "daily|weekly|biweekly|monthly"
  }
}
```

### 4. Update Task
- **PUT** `/api/tasks/:id`
- **Access**: Private

### 5. Complete Task
- **PATCH** `/api/tasks/:id/complete`
- **Access**: Private

### 6. Delete Task
- **DELETE** `/api/tasks/:id`
- **Access**: Private

### 7. Get Today's Tasks
- **GET** `/api/tasks/today`
- **Access**: Private

### 8. Get Upcoming Tasks
- **GET** `/api/tasks/upcoming`
- **Access**: Private

---

## Plant Diagnosis (AI) Endpoints

### 1. Analyze Plant Image
- **POST** `/api/diagnosis/analyze`
- **Access**: Private
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `image`: File (image file)
  - `plantId`: ObjectId (optional)
- **Response**:
```json
{
  "confidence": 94,
  "issue": "Leaf Spot Disease",
  "severity": "Moderate",
  "causes": [
    { "cause": "Fungal infection", "probability": 85 }
  ],
  "treatment": ["Remove affected leaves", "Apply fungicide"],
  "recovery": "1-2 weeks"
}
```

### 2. Get Diagnosis History
- **GET** `/api/diagnosis/history`
- **Access**: Private
- **Query Params**: `?page=1&limit=10`

### 3. Get Single Diagnosis
- **GET** `/api/diagnosis/:id`
- **Access**: Private

### 4. Provide Feedback
- **POST** `/api/diagnosis/:id/feedback`
- **Access**: Private
- **Body**:
```json
{
  "isAccurate": true,
  "rating": 5,
  "comment": "Very helpful!"
}
```

---

## Weather Endpoints

### 1. Get Current Weather
- **GET** `/api/weather/current`
- **Access**: Public
- **Query Params**: `?city=Dhaka` or uses user's location

### 2. Get Weather Forecast
- **GET** `/api/weather/forecast`
- **Access**: Public
- **Query Params**: `?city=Dhaka&days=7`

### 3. Get Weather Alerts
- **GET** `/api/weather/alerts`
- **Access**: Private
- **Response**: Personalized gardening alerts based on weather

### 4. Get Gardening Recommendations
- **GET** `/api/weather/recommendations`
- **Access**: Private
- **Response**: AI-generated care tips based on current weather

---

## Community Forum Endpoints

### 1. Get All Posts
- **GET** `/api/community/posts`
- **Access**: Public
- **Query Params**: `?category=Plant Care&sort=recent&page=1&limit=20`

### 2. Get Single Post
- **GET** `/api/community/posts/:id`
- **Access**: Public

### 3. Create Post
- **POST** `/api/community/posts`
- **Access**: Private
- **Body**:
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "category": "string",
  "tags": ["string"],
  "images": ["string"]
}
```

### 4. Update Post
- **PUT** `/api/community/posts/:id`
- **Access**: Private (own posts only)

### 5. Delete Post
- **DELETE** `/api/community/posts/:id`
- **Access**: Private (own posts only)

### 6. Like Post
- **POST** `/api/community/posts/:id/like`
- **Access**: Private

### 7. Unlike Post
- **DELETE** `/api/community/posts/:id/like`
- **Access**: Private

### 8. Add Reply
- **POST** `/api/community/posts/:id/replies`
- **Access**: Private
- **Body**:
```json
{
  "content": "string (required)"
}
```

### 9. Delete Reply
- **DELETE** `/api/community/posts/:postId/replies/:replyId`
- **Access**: Private (own replies only)

### 10. Get Popular Posts
- **GET** `/api/community/posts/popular`
- **Access**: Public

### 11. Get User's Posts
- **GET** `/api/community/my-posts`
- **Access**: Private

---

## Quote Request Endpoints

### 1. Submit Quote Request
- **POST** `/api/quotes/request`
- **Access**: Private (optional - can work for guests)
- **Body**:
```json
{
  "plant": {
    "name": "string (required)",
    "type": "string",
    "image": "string"
  },
  "supplies": [
    {
      "id": "string",
      "name": "string",
      "category": "essential|optional",
      "quantity": 1
    }
  ],
  "contactInfo": {
    "fullName": "string (required)",
    "phone": "string (required)",
    "email": "string",
    "division": "string (required)",
    "district": "string (required)",
    "area": "string (required)",
    "address": "string (required)",
    "postalCode": "string",
    "contactMethod": "WhatsApp|Phone|Email"
  },
  "notes": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Quote request submitted successfully",
  "data": {
    "requestId": "REQ12345678",
    "status": "pending"
  }
}
```

### 2. Get All Quote Requests (User)
- **GET** `/api/quotes`
- **Access**: Private
- **Query Params**: `?status=pending&page=1&limit=10`

### 3. Get Single Quote Request
- **GET** `/api/quotes/:requestId`
- **Access**: Private

### 4. Cancel Quote Request
- **PATCH** `/api/quotes/:requestId/cancel`
- **Access**: Private

---

## Data Models

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  location: { city, division, district, area },
  gardenType: String,
  spaceSize: String,
  experience: String,
  plants: [String],
  level: String,
  points: Number,
  plantsGrown: Number,
  harvestsCompleted: Number,
  isEmailVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Plant Model
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  type: String,
  variety: String,
  image: String,
  plantedDate: Date,
  expectedHarvestDate: Date,
  daysGrowing: Number,
  health: Number (0-100),
  status: String,
  location: String,
  careSchedule: { watering, fertilizing, pruning },
  notes: [{ date, content, type }],
  harvestLog: [{ date, quantity, unit, quality, notes }],
  isActive: Boolean,
  timestamps: true
}
```

### Task Model
```javascript
{
  user: ObjectId (ref: User),
  plant: ObjectId (ref: Plant),
  plantName: String,
  task: String,
  taskType: String,
  priority: String,
  status: String,
  dueDate: Date,
  time: String,
  completedAt: Date,
  notes: String,
  reminder: { enabled, sentAt },
  recurring: { enabled, frequency, nextOccurrence },
  timestamps: true
}
```

### Post Model (Community)
```javascript
{
  author: ObjectId (ref: User),
  title: String,
  content: String,
  category: String,
  tags: [String],
  images: [String],
  likes: [{ user, likedAt }],
  replies: [{ author, content, createdAt, likes }],
  views: Number,
  isPinned: Boolean,
  isResolved: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

### QuoteRequest Model
```javascript
{
  user: ObjectId (ref: User),
  requestId: String (unique),
  plant: { name, type, image },
  supplies: [{ id, name, category, quantity }],
  contactInfo: { fullName, phone, email, division, district, area, address, postalCode, contactMethod },
  notes: String,
  status: String,
  quotedAmount: Number,
  quotedAt: Date,
  respondedAt: Date,
  completedAt: Date,
  adminNotes: String,
  timestamps: true
}
```

### PlantDiagnosis Model
```javascript
{
  user: ObjectId (ref: User),
  plant: ObjectId (ref: Plant),
  image: String,
  diagnosisResult: { confidence, issue, severity, causes, treatment, recovery, aiModel, processedAt },
  userFeedback: { isAccurate, rating, comment, feedbackAt },
  status: String,
  error: String,
  timestamps: true
}
```

---

## Environment Variables

Required in `.env` file:
```
PORT=8001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urbaneos
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PLANT_ID_API_KEY=your_api_key
OPENWEATHER_API_KEY=your_api_key
FRONTEND_URL=http://localhost:3000
```

---

## Error Handling

All errors return in format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {} // Optional validation errors
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication

Include JWT token in all protected routes:
```
Authorization: Bearer <your_jwt_token>
```

Token expires in 7 days by default.

---

## Pagination

All list endpoints support pagination:
- Query params: `?page=1&limit=20`
- Response includes: `{ data: [], total, page, pages }`

---

## Bangladesh-Specific Features

1. **Phone Validation**: Supports `+880`, `880`, `0` prefixes for Bangladesh numbers
2. **Divisions**: Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh
3. **Weather**: Localized for Bangladesh cities
4. **Plant Database**: Optimized for Bangladesh climate

---

## Notes

- All dates are in ISO 8601 format
- All responses include `success` boolean field
- File uploads limited to 5MB
- Rate limiting may be implemented in production
