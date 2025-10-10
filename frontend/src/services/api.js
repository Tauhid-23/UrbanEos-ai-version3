import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('urbaneos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('urbaneos_token');
      localStorage.removeItem('urbaneos_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      gardenType: userData.gardenType || '',
      spaceArea: parseFloat(userData.spaceSize) || 0
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (updates) => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  }
};

// ========== PLANTS API ==========
export const plantsAPI = {
  getAll: async () => {
    const response = await api.get('/plants');
    return response.data;
  },

  create: async (plantData) => {
    const response = await api.post('/plants', plantData);
    return response.data;
  },

  update: async (plantId, updates) => {
    const response = await api.put(`/plants/${plantId}`, updates);
    return response.data;
  },

  delete: async (plantId) => {
    const response = await api.delete(`/plants/${plantId}`);
    return response.data;
  }
};

// ========== TASKS API ==========
export const tasksAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },

  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  update: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  }
};

// ========== DIAGNOSIS API ==========
export const diagnosisAPI = {
  identify: async (imageBase64) => {
    const response = await api.post('/diagnosis/identify', { imageBase64 });
    return response.data;
  },

  diagnoseHealth: async (imageBase64, plantId = null) => {
    const response = await api.post('/diagnosis/health', { imageBase64, plantId });
    return response.data;
  }
};

// ========== WEATHER API ==========
export const weatherAPI = {
  getCurrent: async (lat, lon) => {
    const response = await api.get('/weather', { params: { lat, lon } });
    return response.data;
  }
};

// ========== DASHBOARD API ==========
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export default api;
