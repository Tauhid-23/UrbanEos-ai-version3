import React from 'react';
import { Sun, Cloud, Droplets, Wind, Eye, AlertTriangle, TrendingUp } from 'lucide-react';
import { mockWeather, mockUser } from '../../data/mock';

const WeatherAlerts = () => {
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'Partly Cloudy': return <Cloud className="h-8 w-8 text-blue-400" />;
      case 'Cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'Rainy': return <Droplets className="h-8 w-8 text-blue-600" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Extreme', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const uvLevel = getUVLevel(mockWeather.uvIndex);

  const gardeningAlerts = [
    {
      type: 'temperature',
      severity: 'medium',
      title: 'High Temperature Alert',
      message: mockWeather.alert,
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      color: 'border-orange-200 bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Weather & Alerts ☀️</h1>
        <p className="text-xl text-gray-600">
          Real-time weather data and AI-powered gardening recommendations for {mockUser.location}
        </p>
      </div>

      {/* Current Weather Hero Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-2xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              {getWeatherIcon(mockWeather.condition)}
              <div>
                <div className="text-6xl font-bold mb-2">{mockWeather.temp}°C</div>
                <div className="text-2xl text-blue-100">{mockWeather.condition}</div>
              </div>
            </div>
            <div className="text-blue-200 text-lg">
              📍 {mockUser.location}
            </div>
            <div className="text-blue-200 text-sm mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Wind className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{mockWeather.wind}</div>
              <div className="text-sm text-blue-200">km/h Wind</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{mockWeather.humidity}%</div>
              <div className="text-sm text-blue-200">Humidity</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">10km</div>
              <div className="text-sm text-blue-200">Visibility</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">1013</div>
              <div className="text-sm text-blue-200">hPa Pressure</div>
            </div>
          </div>
        </div>
      </div>

      {/* UV Index Alert */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">UV Index</h3>
          <div className={`px-4 py-2 rounded-full ${uvLevel.bg} ${uvLevel.color} font-semibold`}>
            {uvLevel.level}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{mockWeather.uvIndex}</div>
            <div className="text-sm text-gray-600">Current UV Index</div>
          </div>
          
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full ${
                  mockWeather.uvIndex <= 2 ? 'bg-green-500' :
                  mockWeather.uvIndex <= 5 ? 'bg-yellow-500' :
                  mockWeather.uvIndex <= 7 ? 'bg-orange-500' :
                  mockWeather.uvIndex <= 10 ? 'bg-red-500' : 'bg-purple-500'
                }`}
                style={{ width: `${Math.min((mockWeather.uvIndex / 12) * 100, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">
              {mockWeather.uvIndex <= 2 && 'Safe for outdoor activities'}
              {mockWeather.uvIndex > 2 && mockWeather.uvIndex <= 5 && 'Moderate risk - use sun protection'}
              {mockWeather.uvIndex > 5 && mockWeather.uvIndex <= 7 && 'High risk - protect plants and skin'}
              {mockWeather.uvIndex > 7 && mockWeather.uvIndex <= 10 && 'Very high risk - provide shade for sensitive plants'}
              {mockWeather.uvIndex > 10 && 'Extreme risk - avoid direct sun exposure'}
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockWeather.forecast.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-semibold text-gray-900 mb-2">{day.day}</div>
              <div className="text-3xl mb-2">{day.icon}</div>
              <div className="text-xl font-bold text-gray-900 mb-1">{day.temp}°C</div>
              <div className="text-sm text-gray-600">{day.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gardening Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Gardening Alerts</h3>
        
        <div className="space-y-4">
          {gardeningAlerts.map((alert, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${alert.color}`}>
              <div className="flex items-start space-x-3">
                {alert.icon}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                  <p className="text-gray-700">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garden Care Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Garden Care Tips</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Watering Schedule</h4>
                <p className="text-gray-700 text-sm">Water plants early morning due to high temperatures expected today</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sun Protection</h4>
                <p className="text-gray-700 text-sm">Provide shade for sensitive plants between 11 AM - 3 PM</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Plant Monitoring</h4>
                <p className="text-gray-700 text-sm">Check for heat stress signs: wilting or yellowing leaves</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Optimal Care Time</h4>
                <p className="text-gray-700 text-sm">Best time for garden maintenance: 6-8 AM or after 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;