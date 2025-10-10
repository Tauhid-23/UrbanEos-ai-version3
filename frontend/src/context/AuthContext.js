import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('urbaneos_token');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.user);
        // Also save to localStorage for compatibility
        localStorage.setItem('urbaneos_user', JSON.stringify(response.user));
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('urbaneos_token');
        localStorage.removeItem('urbaneos_user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('urbaneos_token', response.token);
    localStorage.setItem('urbaneos_user', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    localStorage.setItem('urbaneos_token', response.token);
    localStorage.setItem('urbaneos_user', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('urbaneos_token');
    localStorage.removeItem('urbaneos_user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('urbaneos_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
