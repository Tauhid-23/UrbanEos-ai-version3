import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Home, Sprout, ListTodo, Activity, Database, Cloud, Users, 
  Settings, LogOut, Plus, Trash2, Edit, Check, X, Menu, 
  Camera, Upload, Loader2, Calendar, Search, Bell, User
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ========== API SERVICE ==========
const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH CONTEXT ==========
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    sessionStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ========== PROTECTED ROUTE ==========
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-green-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ========== LANDING PAGE ==========
const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">UrbanEos AI</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-green-600 hover:text-green-700 font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered Urban
            <span className="text-green-600"> Gardening Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your balcony or rooftop into a thriving garden with AI plant identification, 
            health diagnosis, smart task management, and personalized care recommendations.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg"
          >
            Start Growing Today
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Plant Scanner</h3>
            <p className="text-gray-600">Instantly identify plants and diagnose health issues with advanced AI technology</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ListTodo className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Task Manager</h3>
            <p className="text-gray-600">Never miss watering or fertilizing with intelligent reminders and scheduling</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Cloud className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Weather Integration</h3>
            <p className="text-gray-600">Get real-time weather alerts and gardening tips based on local conditions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== LOGIN PAGE ==========
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sprout className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

// ========== SIGNUP PAGE ==========
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gardenType: 'balcony',
    spaceArea: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sprout className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Garden Type</label>
            <select
              value={formData.gardenType}
              onChange={(e) => setFormData({...formData, gardenType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="balcony">Balcony</option>
              <option value="roof">Rooftop</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Space Area (sq ft)</label>
            <input
              type="number"
              value={formData.spaceArea}
              onChange={(e) => setFormData({...formData, spaceArea: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// ========== DASHBOARD LAYOUT ==========
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Sprout, label: 'My Garden', path: '/dashboard/garden' },
    { icon: ListTodo, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: Activity, label: 'Plant Diagnosis', path: '/dashboard/diagnosis' },
    { icon: Cloud, label: 'Weather', path: '/dashboard/weather' },
    { icon: Database, label: 'Plant Database', path: '/dashboard/database' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-800">UrbanEos</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Level {user?.level}</p>
                <p className="text-xs text-gray-500">{user?.points} points</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// ========== DASHBOARD HOME ==========
const DashboardHome = () => {
  const [stats, setStats] = useState({ plants: 0, tasks: 0, health: 0 });
  const [tasks, setTasks] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes, weatherRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/tasks?status=pending'),
        api.get('/weather?lat=23.8103&lon=90.4125')
      ]);

      setStats(statsRes.data.stats);
      setTasks(tasksRes.data.tasks.slice(0, 5));
      setWeather(weatherRes.data.weather);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin h-12 w-12 text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Plants</h3>
              <p className="text-4xl font-bold">{stats.plants}</p>
            </div>
            <Sprout className="h-12 w-12 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
              <p className="text-4xl font-bold">{stats.tasks}</p>
            </div>
            <ListTodo className="h-12 w-12 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Avg Health</h3>
              <p className="text-4xl font-bold">{stats.health}%</p>
            </div>
            <Activity className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      {weather && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-500" />
            Today's Weather
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-5xl font-bold text-gray-800">{weather.current.temp}°C</div>
            <div>
              <p className="text-lg text-gray-700 capitalize">{weather.current.description}</p>
              <p className="text-sm text-gray-500">Humidity: {weather.current.humidity}%</p>
              <p className="text-sm text-gray-500">Wind: {weather.current.windSpeed} m/s</p>
            </div>
          </div>
          
          {weather.alerts && weather.alerts.length > 0 && (
            <div className="mt-4 space-y-2">
              {weather.alerts.map((alert, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                  alert.type === 'info' ? 'bg-blue-50 text-blue-700' :
                  'bg-green-50 text-green-700'
                }`}>
                  <Bell className="inline h-4 w-4 mr-2" />
                  {alert.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending tasks. Great job! 🎉</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.plantName || 'General Task'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.priority === 'high' || task.priority === 'urgent' 
                    ? 'bg-red-100 text-red-700' 
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ========== MY GARDEN PAGE ==========
const MyGardenPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    scientificName: '',
    type: '',
    location: 'balcony',
    status: 'growing',
    notes: ''
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await api.get('/plants');
      setPlants(response.data.plants);
    } catch (err) {
      console.error('Failed to load plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    try {
      await api.post('/plants', newPlant);
      setShowAddModal(false);
      setNewPlant({ name: '', scientificName: '', type: '', location: 'balcony', status: 'growing', notes: '' });
      fetchPlants();
    } catch (err) {
      alert('Failed to add plant');
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (!window.confirm('Delete this plant?')) return;
    try {
      await api.delete(`/plants/${plantId}`);
      setPlants(plants.filter(p => p.id !== plantId));
    } catch (err) {
      alert('Failed to delete plant');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin h-12 w-12 text-green-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Garden</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Add Plant
        </button>
      </div>

      {plants.length === 0 ? (
        <div className="text-center py-20">
          <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No plants yet. Add your first plant!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <Sprout className="h-20 w-20 text-green-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plant.name}</h3>
                <p className="text-gray-600 text-sm mb-4 italic">{plant.scientificName || 'Unknown species'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium capitalize">{plant.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{plant.status}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Health</span>
                    <span className="font-medium">{plant.health}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${plant.health}%` }}
                    ></div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeletePlant(plant.id)}
                  className="w-full text-red-500 hover:bg-red-50 py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Plant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Add New Plant</h3>
            <form onSubmit={handleAddPlant} className="space-y-4">
              <input
                type="text"
                placeholder="Plant Name *"
                value={newPlant.name}
                onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                placeholder="Scientific Name (Optional)"
                value={newPlant.scientificName}
                onChange={(e) => setNewPlant({...newPlant, scientificName: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Type (e.g., Vegetable, Herb) *"
                value={newPlant.type}
                onChange={(e) => setNewPlant({...newPlant, type: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                value={newPlant.location}
                onChange={(e) => setNewPlant({...newPlant, location: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="balcony">Balcony</option>
                <option value="roof">Rooftop</option>
                <option value="indoor">Indoor</option>
              </select>
              <textarea
                placeholder="Notes (Optional)"
                value={newPlant.notes}
                onChange={(e) => setNewPlant({...newPlant, notes: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== TASKS PAGE (Placeholder) ==========
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin h-12 w-12 text-green-600" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Task Manager</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-20">
          <ListTodo className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== OTHER PAGES (Placeholders) ==========
const DiagnosisPage = () => <div className="text-center py-20"><Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Plant Diagnosis - Coming Soon</p></div>;
const WeatherPage = () => <div className="text-center py-20"><Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Weather - Coming Soon</p></div>;
const DatabasePage = () => <div className="text-center py-20"><Database className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Plant Database - Coming Soon</p></div>;
const ProfilePage = () => <div className="text-center py-20"><User className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Profile - Coming Soon</p></div>;

// ========== MAIN APP ==========
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/garden" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyGardenPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/tasks" element={
            <ProtectedRoute>
              <DashboardLayout>
                <TasksPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/diagnosis" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DiagnosisPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/weather" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WeatherPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/database" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DatabasePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
