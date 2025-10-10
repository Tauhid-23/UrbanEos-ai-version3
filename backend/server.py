from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import base64
import httpx
import cloudinary
import cloudinary.uploader

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client['urbaneos_db']

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 7

security = HTTPBearer()

app = FastAPI(title="UrbanEos AI API")
api_router = APIRouter(prefix="/api")

# ========== MODELS ==========

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = ''
    gardenType: Optional[str] = ''
    spaceArea: Optional[float] = 0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str = ''
    division: str = ''
    district: str = ''
    address: str = ''
    gardenType: str = ''
    spaceArea: float = 0
    sunlight: str = ''
    experience: str = 'beginner'
    level: int = 1
    points: int = 0
    avatar: str = ''
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    gardenType: str = ''
    level: int = 1
    points: int = 0
    avatar: str = ''

class AuthResponse(BaseModel):
    success: bool
    token: str
    user: UserResponse

class Plant(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    name: str
    scientificName: str = ''
    type: str
    variety: str = ''
    location: str = 'balcony'
    photos: List[str] = []
    plantedDate: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = 'growing'
    health: float = 100
    sunNeeds: str = 'partial'
    waterNeeds: str = 'moderate'
    difficulty: str = 'moderate'
    harvestCount: int = 0
    lastWatered: Optional[datetime] = None
    lastFertilized: Optional[datetime] = None
    notes: str = ''
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlantCreate(BaseModel):
    name: str
    scientificName: str = ''
    type: str
    variety: str = ''
    location: str = 'balcony'
    photos: List[str] = []
    status: str = 'growing'
    health: float = 100
    sunNeeds: str = 'partial'
    waterNeeds: str = 'moderate'
    difficulty: str = 'moderate'
    notes: str = ''

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    plantId: Optional[str] = None
    plantName: Optional[str] = None
    title: str
    description: str = ''
    category: str = 'other'
    status: str = 'pending'
    priority: str = 'medium'
    dueDate: datetime
    completedDate: Optional[datetime] = None
    recurring: bool = False
    recurringInterval: Optional[int] = None
    notes: str = ''
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    plantId: Optional[str] = None
    title: str
    description: str = ''
    category: str = 'other'
    priority: str = 'medium'
    dueDate: datetime
    recurring: bool = False
    recurringInterval: Optional[int] = None
    notes: str = ''

class WeatherData(BaseModel):
    temp: float
    feelsLike: float
    humidity: int
    description: str
    icon: str
    windSpeed: float
    pressure: int

class DiagnosisRequest(BaseModel):
    imageBase64: str
    plantId: Optional[str] = None

# ========== HELPER FUNCTIONS ==========

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        if not user_id:
            raise HTTPException(status_code=401, detail='Invalid token')
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')

# ========== AUTH ROUTES ==========

@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail='User already exists')
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        gardenType=user_data.gardenType,
        spaceArea=user_data.spaceArea
    )
    
    user_dict = user.model_dump()
    user_dict['password'] = hash_password(user_data.password)
    user_dict['createdAt'] = user_dict['createdAt'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    token = create_token(user.id)
    
    return AuthResponse(
        success=True,
        token=token,
        user=UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            gardenType=user.gardenType,
            level=user.level,
            points=user.points,
            avatar=user.avatar
        )
    )

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(login_data: UserLogin):
    user = await db.users.find_one({'email': login_data.email})
    if not user or not verify_password(login_data.password, user['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    token = create_token(user['id'])
    
    return AuthResponse(
        success=True,
        token=token,
        user=UserResponse(
            id=user['id'],
            name=user['name'],
            email=user['email'],
            gardenType=user.get('gardenType', ''),
            level=user.get('level', 1),
            points=user.get('points', 0),
            avatar=user.get('avatar', '')
        )
    )

@api_router.get("/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({'id': user_id}, {'_id': 0, 'password': 0})
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return {'success': True, 'user': user}

@api_router.put("/auth/profile")
async def update_profile(updates: dict, user_id: str = Depends(get_current_user)):
    allowed_fields = ['name', 'phone', 'division', 'district', 'address', 'avatar', 'gardenType', 'spaceArea']
    update_data = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if update_data:
        await db.users.update_one({'id': user_id}, {'$set': update_data})
    
    user = await db.users.find_one({'id': user_id}, {'_id': 0, 'password': 0})
    return {'success': True, 'user': user}

# ========== PLANT ROUTES ==========

@api_router.get("/plants")
async def get_plants(user_id: str = Depends(get_current_user)):
    plants = await db.plants.find({'userId': user_id}, {'_id': 0}).to_list(1000)
    for plant in plants:
        if isinstance(plant.get('plantedDate'), str):
            plant['plantedDate'] = datetime.fromisoformat(plant['plantedDate'])
        if isinstance(plant.get('createdAt'), str):
            plant['createdAt'] = datetime.fromisoformat(plant['createdAt'])
    return {'success': True, 'count': len(plants), 'plants': plants}

@api_router.post("/plants")
async def create_plant(plant_data: PlantCreate, user_id: str = Depends(get_current_user)):
    plant = Plant(**plant_data.model_dump(), userId=user_id)
    plant_dict = plant.model_dump()
    plant_dict['plantedDate'] = plant_dict['plantedDate'].isoformat()
    plant_dict['createdAt'] = plant_dict['createdAt'].isoformat()
    
    await db.plants.insert_one(plant_dict)
    return {'success': True, 'plant': plant_dict}

@api_router.put("/plants/{plant_id}")
async def update_plant(plant_id: str, updates: dict, user_id: str = Depends(get_current_user)):
    plant = await db.plants.find_one({'id': plant_id, 'userId': user_id})
    if not plant:
        raise HTTPException(status_code=404, detail='Plant not found')
    
    await db.plants.update_one({'id': plant_id}, {'$set': updates})
    updated_plant = await db.plants.find_one({'id': plant_id}, {'_id': 0})
    return {'success': True, 'plant': updated_plant}

@api_router.delete("/plants/{plant_id}")
async def delete_plant(plant_id: str, user_id: str = Depends(get_current_user)):
    result = await db.plants.delete_one({'id': plant_id, 'userId': user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Plant not found')
    return {'success': True, 'message': 'Plant deleted'}

# ========== TASK ROUTES ==========

@api_router.get("/tasks")
async def get_tasks(
    user_id: str = Depends(get_current_user),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    date: Optional[str] = None
):
    query = {'userId': user_id}
    if status:
        query['status'] = status
    if priority:
        query['priority'] = priority
    
    tasks = await db.tasks.find(query, {'_id': 0}).to_list(1000)
    
    # Parse datetime strings
    for task in tasks:
        if isinstance(task.get('dueDate'), str):
            task['dueDate'] = datetime.fromisoformat(task['dueDate'])
        if isinstance(task.get('createdAt'), str):
            task['createdAt'] = datetime.fromisoformat(task['createdAt'])
        if task.get('completedDate') and isinstance(task['completedDate'], str):
            task['completedDate'] = datetime.fromisoformat(task['completedDate'])
    
    # Sort by due date
    tasks.sort(key=lambda x: x['dueDate'])
    
    return {'success': True, 'count': len(tasks), 'tasks': tasks}

@api_router.post("/tasks")
async def create_task(task_data: TaskCreate, user_id: str = Depends(get_current_user)):
    # Get plant name if plantId provided
    plant_name = None
    if task_data.plantId:
        plant = await db.plants.find_one({'id': task_data.plantId, 'userId': user_id})
        if plant:
            plant_name = plant['name']
    
    task = Task(**task_data.model_dump(), userId=user_id, plantName=plant_name)
    task_dict = task.model_dump()
    task_dict['dueDate'] = task_dict['dueDate'].isoformat()
    task_dict['createdAt'] = task_dict['createdAt'].isoformat()
    
    await db.tasks.insert_one(task_dict)
    return {'success': True, 'task': task_dict}

@api_router.put("/tasks/{task_id}")
async def update_task(task_id: str, updates: dict, user_id: str = Depends(get_current_user)):
    task = await db.tasks.find_one({'id': task_id, 'userId': user_id})
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    
    if updates.get('status') == 'completed' and not task.get('completedDate'):
        updates['completedDate'] = datetime.now(timezone.utc).isoformat()
    
    await db.tasks.update_one({'id': task_id}, {'$set': updates})
    updated_task = await db.tasks.find_one({'id': task_id}, {'_id': 0})
    return {'success': True, 'task': updated_task}

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, user_id: str = Depends(get_current_user)):
    result = await db.tasks.delete_one({'id': task_id, 'userId': user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail='Task not found')
    return {'success': True, 'message': 'Task deleted'}

# ========== AI DIAGNOSIS ROUTES ==========

@api_router.post("/diagnosis/identify")
async def identify_plant(request: DiagnosisRequest, user_id: str = Depends(get_current_user)):
    try:
        api_key = os.environ.get('PLANT_ID_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail='Plant.id API key not configured')
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                'https://api.plant.id/v2/identify',
                json={
                    'images': [request.imageBase64],
                    'modifiers': ['crops_fast', 'similar_images'],
                    'plant_language': 'en',
                    'plant_details': [
                        'common_names',
                        'scientific_name',
                        'taxonomy',
                        'description',
                        'watering',
                        'sunlight'
                    ]
                },
                headers={'Api-Key': api_key, 'Content-Type': 'application/json'}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail='Plant identification failed')
            
            data = response.json()
            suggestion = data['suggestions'][0]
            plant_details = suggestion.get('plant_details', {})
            
            result = {
                'name': suggestion['plant_name'],
                'scientificName': plant_details.get('scientific_name', {}).get('value', ''),
                'confidence': round(suggestion['probability'] * 100, 1),
                'commonNames': plant_details.get('common_names', []),
                'description': plant_details.get('description', {}).get('value', ''),
                'type': plant_details.get('taxonomy', {}).get('genus', 'Unknown'),
                'sunNeeds': 'partial',
                'waterNeeds': 'moderate',
                'difficulty': 'moderate',
                'image': suggestion.get('similar_images', [{}])[0].get('url', '') if suggestion.get('similar_images') else ''
            }
            
            return {'success': True, 'result': result}
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail='Plant identification service timeout')
    except Exception as e:
        logging.error(f'Plant identification error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to identify plant: {str(e)}')

@api_router.post("/diagnosis/health")
async def diagnose_health(request: DiagnosisRequest, user_id: str = Depends(get_current_user)):
    try:
        api_key = os.environ.get('PLANT_ID_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail='Plant.id API key not configured')
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                'https://api.plant.id/v2/health_assessment',
                json={
                    'images': [request.imageBase64],
                    'modifiers': ['crops_fast', 'similar_images'],
                    'disease_details': ['cause', 'common_names', 'classification', 'description', 'treatment', 'url']
                },
                headers={'Api-Key': api_key, 'Content-Type': 'application/json'}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail='Health diagnosis failed')
            
            data = response.json()
            health = data.get('health_assessment', {})
            diseases = health.get('diseases', [])
            
            diagnosis = {
                'isHealthy': health.get('is_healthy', True),
                'healthScore': round(health.get('is_healthy_probability', 1.0) * 100, 1),
                'diseases': [{
                    'name': d['name'],
                    'probability': round(d['probability'] * 100, 1),
                    'description': d.get('disease_details', {}).get('description', ''),
                    'treatment': d.get('disease_details', {}).get('treatment', ''),
                    'cause': d.get('disease_details', {}).get('cause', '')
                } for d in diseases],
                'recommendations': [
                    'Your plant looks healthy! Continue regular care.'
                ] if not diseases else diseases[0].get('disease_details', {}).get('treatment', '').split('.') if diseases else []
            }
            
            # Update plant health if plantId provided
            if request.plantId:
                await db.plants.update_one(
                    {'id': request.plantId, 'userId': user_id},
                    {'$set': {'health': diagnosis['healthScore']}}
                )
            
            return {'success': True, 'diagnosis': diagnosis}
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail='Health diagnosis service timeout')
    except Exception as e:
        logging.error(f'Health diagnosis error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to diagnose plant: {str(e)}')

# ========== WEATHER ROUTES ==========

@api_router.get("/weather")
async def get_weather(lat: float, lon: float, user_id: str = Depends(get_current_user)):
    try:
        api_key = os.environ.get('OPENWEATHER_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail='OpenWeather API key not configured')
        
        async with httpx.AsyncClient() as client:
            current_response = await client.get(
                'https://api.openweathermap.org/data/2.5/weather',
                params={'lat': lat, 'lon': lon, 'appid': api_key, 'units': 'metric'}
            )
            
            forecast_response = await client.get(
                'https://api.openweathermap.org/data/2.5/forecast',
                params={'lat': lat, 'lon': lon, 'appid': api_key, 'units': 'metric'}
            )
            
            current = current_response.json()
            forecast = forecast_response.json()
            
            weather_data = {
                'current': {
                    'temp': round(current['main']['temp']),
                    'feelsLike': round(current['main']['feels_like']),
                    'humidity': current['main']['humidity'],
                    'description': current['weather'][0]['description'],
                    'icon': current['weather'][0]['icon'],
                    'windSpeed': current['wind']['speed'],
                    'pressure': current['main']['pressure']
                },
                'forecast': [{
                    'date': datetime.fromtimestamp(day['dt']).strftime('%a'),
                    'temp': round(day['main']['temp']),
                    'description': day['weather'][0]['description'],
                    'icon': day['weather'][0]['icon'],
                    'humidity': day['main']['humidity']
                } for idx, day in enumerate(forecast['list']) if idx % 8 == 0][:5],
                'alerts': []
            }
            
            # Generate alerts
            if current['main']['temp'] > 35:
                weather_data['alerts'].append({
                    'type': 'warning',
                    'message': 'High temperature! Water plants in early morning or evening.'
                })
            
            if current['main']['humidity'] < 40:
                weather_data['alerts'].append({
                    'type': 'info',
                    'message': 'Low humidity. Consider misting your plants.'
                })
            
            return {'success': True, 'weather': weather_data}
            
    except Exception as e:
        logging.error(f'Weather API error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Failed to fetch weather: {str(e)}')

# ========== DASHBOARD STATS ==========

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    plants = await db.plants.find({'userId': user_id}).to_list(1000)
    tasks = await db.tasks.find({'userId': user_id, 'status': 'pending'}).to_list(1000)
    
    avg_health = sum(p.get('health', 100) for p in plants) / len(plants) if plants else 0
    
    return {
        'success': True,
        'stats': {
            'plants': len(plants),
            'tasks': len(tasks),
            'health': round(avg_health)
        }
    }

# Health check
@api_router.get("/health")
async def health_check():
    return {'status': 'ok', 'message': 'UrbanEos API is running'}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
