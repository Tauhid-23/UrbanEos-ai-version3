# UrbanEos AI - Frontend/Backend Integration Contracts

## Overview
This document outlines the API contracts and integration requirements for connecting the UrbanEos AI frontend with the backend using Plant.id and other APIs mentioned in the user requirements.

## Current Mock Data in Frontend

### 1. User Authentication
**Mock Data Location:** `src/data/mock.js` - `mockUser`
**Data Structure:**
```javascript
{
  name: 'Ahmed Rahman',
  email: 'ahmed@example.com',
  gardenType: 'balcony',
  level: 'Blooming Gardener', 
  points: 1250,
  location: 'Dhaka, Bangladesh',
  avatar: 'AR'
}
```
**Backend Requirements:**
- JWT-based authentication system
- User registration/login endpoints
- Profile management with garden type and location
- User level/points system for gamification

### 2. Plant Management
**Mock Data Location:** `src/data/mock.js` - `mockPlants`
**Current Mock Structure:**
```javascript
{
  id: 1,
  name: 'Basil',
  health: 95,
  status: 'healthy',
  image: '🌿',
  daysGrowing: 23,
  nextHarvest: 12,
  type: 'Herb'
}
```
**Backend Requirements:**
- Plant CRUD operations
- Health tracking and status updates
- Growth timeline management
- Plant image handling (emoji or actual images)

### 3. Plant Database
**Mock Data Location:** `src/data/mock.js` - `mockPlantDatabase`
**Integration with Perenual API:**
- Use Perenual Plant API for detailed plant information
- Cache plant data locally for performance
- Sync with Bangladesh-specific growing conditions

### 4. Plant Diagnosis
**Current Mock:** Simulated AI response with 3-second delay
**Integration with Plant.id API:**
- Primary: Plant.id API (100 requests/month free)
- Backup: Hugging Face API (30k requests/month free)
- Image upload handling
- Result caching to optimize API usage

### 5. Weather Integration
**Mock Data Location:** `src/data/mock.js` - `mockWeather`
**Integration with OpenWeatherMap:**
- Current weather data
- 5-day forecast
- Weather alerts for gardening
- Location-based data for Bangladesh

### 6. Task Management
**Mock Data Location:** `src/data/mock.js` - `mockTasks`
**Backend Requirements:**
- Task CRUD operations
- Due date management
- Task status tracking (pending/completed)
- Plant-specific task associations

### 7. Community Forum
**Mock Data Location:** `src/data/mock.js` - `mockCommunityPosts`
**Backend Requirements:**
- Post creation and management
- User interactions (likes, comments)
- Category-based filtering
- User reputation system

### 8. Blog System
**Mock Data Location:** `src/data/mock.js` - `mockBlogArticles`
**Backend Requirements:**
- Article content management
- Category and tag system
- Author management
- SEO-friendly URLs (slug-based)

## API Endpoints to Implement

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
GET /api/auth/profile
PUT /api/auth/profile
```

### Plant Management Endpoints
```
GET /api/plants
POST /api/plants
GET /api/plants/:id
PUT /api/plants/:id
DELETE /api/plants/:id
```

### Plant Database Endpoints
```
GET /api/database/plants
GET /api/database/plants/search?q={query}&type={type}
GET /api/database/plants/:id
```

### Plant Diagnosis Endpoints
```
POST /api/diagnosis/analyze
- Body: { image: base64, plantId?: string }
- Response: { confidence, issue, severity, causes, treatment, recovery }
```

### Weather Endpoints
```
GET /api/weather/current?lat={lat}&lon={lon}
GET /api/weather/forecast?lat={lat}&lon={lon}
GET /api/weather/alerts?location={location}
```

### Task Management Endpoints
```
GET /api/tasks
POST /api/tasks
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

### Community Endpoints
```
GET /api/community/posts
POST /api/community/posts
GET /api/community/posts/:id
PUT /api/community/posts/:id/like
POST /api/community/posts/:id/comments
```

### Blog Endpoints
```
GET /api/blog/articles
GET /api/blog/articles/:slug
GET /api/blog/categories
```

## External API Integrations Required

### 1. Plant.id API Integration
**Purpose:** AI plant diagnosis
**Endpoints:**
- `https://api.plant.id/v2/identify`
- `https://api.plant.id/v2/health_assessment`
**Rate Limits:** 100 requests/month (free tier)

### 2. Perenual Plant API Integration
**Purpose:** Plant database and care information
**Endpoint:** `https://perenual.com/api/species-list`
**Rate Limits:** 100 requests/day (free tier)

### 3. OpenWeatherMap API Integration
**Purpose:** Weather data and forecasts
**Endpoints:**
- Current weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-day forecast: `https://api.openweathermap.org/data/2.5/forecast`
**Rate Limits:** 1,000 calls/day (free tier)

### 4. Hugging Face API Integration (Backup)
**Purpose:** Backup plant diagnosis
**Endpoint:** `https://api-inference.huggingface.co/models/`
**Rate Limits:** 30,000 requests/month (free tier)

## Database Schema Requirements

### Users Table
```sql
- id, email, password_hash, name, garden_type, location, level, points, created_at, updated_at
```

### Plants Table
```sql
- id, user_id, name, type, health, status, days_growing, planted_date, expected_harvest_date, image, created_at, updated_at
```

### Tasks Table
```sql
- id, user_id, plant_id, title, description, due_date, status, priority, created_at, updated_at
```

### Posts Table
```sql
- id, user_id, title, content, category, likes_count, replies_count, created_at, updated_at
```

### Articles Table
```sql
- id, title, slug, content, excerpt, author, category, published_date, featured_image, tags
```

## Environment Variables Required

```
PLANT_ID_API_KEY=your_plant_id_key
PERENUAL_API_KEY=your_perenual_key  
OPENWEATHER_API_KEY=your_openweather_key
HUGGING_FACE_API_KEY=your_hf_key
JWT_SECRET=your_jwt_secret
MONGO_URL=your_mongodb_connection
```

## Frontend Integration Points

### Remove Mock Data
1. Replace imports from `src/data/mock.js` with API calls
2. Update all components to use real API endpoints
3. Add loading states and error handling
4. Implement proper authentication flow

### Add API Service Layer
Create `src/services/api.js` with methods for all endpoints

### Add Authentication Context
Implement React context for user authentication state management

### Add Error Handling
Global error boundary and toast notifications for API errors

### Add Loading States
Skeleton loaders and loading indicators for all API calls

## Testing Requirements

### Backend Testing
- Unit tests for all API endpoints
- Integration tests with external APIs
- Rate limiting and error handling tests

### Frontend Integration Testing
- E2E tests for complete user flows
- API integration tests
- Authentication flow testing
- Plant diagnosis workflow testing

## Performance Optimizations

### API Caching
- Cache weather data for 30 minutes
- Cache plant database queries for 24 hours
- Cache diagnosis results for 7 days

### Image Handling
- Compress images before API calls
- Use progressive image loading
- Implement image caching strategy

### Rate Limiting
- Implement API rate limiting to avoid quota exhaustion
- Queue diagnosis requests during high usage
- Graceful degradation when APIs are unavailable

## Security Considerations

### API Keys
- Store all API keys in environment variables
- Implement API key rotation strategy
- Monitor API usage and alerts

### User Data
- Hash passwords with bcrypt
- Validate all user inputs
- Implement proper session management
- Add CORS protection

### File Uploads
- Validate image file types and sizes
- Implement virus scanning for uploads
- Use secure cloud storage for images

This contracts document provides a comprehensive guide for implementing the backend and integrating it seamlessly with the existing frontend mock implementation.