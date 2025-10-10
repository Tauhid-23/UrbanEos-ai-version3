import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Mail, Lock, User, MapPin, Home, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
    gardenType: '',
    location: '',
    spaceSize: '',
    plants: [],
    experience: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlantToggle = (plant) => {
    setFormData(prev => ({
      ...prev,
      plants: prev.plants.includes(plant)
        ? prev.plants.filter(p => p !== plant)
        : [...prev.plants, plant]
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Details' },
    { number: 2, title: 'Garden Setup' },
    { number: 3, title: 'Preferences' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <div className="text-8xl mb-6">🌱</div>
          <h2 className="text-3xl font-bold mb-4">Join 10,000+ Urban Gardeners</h2>
          <p className="text-xl mb-8 opacity-90">
            Start growing fresh vegetables and herbs in your own space
          </p>
          
          <div className="space-y-4 max-w-md">
            {[
              'AI-powered plant diagnosis',
              'Personalized care reminders',
              'Expert community support',
              'Weather-based alerts'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-sm">✓</span>
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <p className="text-sm opacity-75 mb-2">Join thousands of successful gardeners</p>
            <div className="flex -space-x-2 justify-center">
              {['🧑‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🌾'].map((avatar, i) => (
                <div key={i} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg border-2 border-white border-opacity-30">
                  {avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 lg:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">UrbanEos AI</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Growing Today!</h1>
            <p className="text-gray-600">Create your free account in 2 minutes</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${currentStep >= step.number 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-12 h-1 mx-2
                      ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary w-full py-3 text-lg"
                >
                  Next Step
                </button>
              </div>
            )}

            {/* Step 2: Garden Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Garden Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What type of garden do you have?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gardenType: 'balcony' }))}
                      className={`
                        p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all
                        ${formData.gardenType === 'balcony'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <Home className="h-8 w-8 text-green-600" />
                      <span className="font-medium">Balcony</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gardenType: 'roof' }))}
                      className={`
                        p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all
                        ${formData.gardenType === 'roof'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <Building className="h-8 w-8 text-green-600" />
                      <span className="font-medium">Rooftop</span>
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select your city</option>
                      <option value="dhaka">Dhaka</option>
                      <option value="chittagong">Chittagong</option>
                      <option value="sylhet">Sylhet</option>
                      <option value="rajshahi">Rajshahi</option>
                      <option value="khulna">Khulna</option>
                      <option value="barisal">Barisal</option>
                      <option value="rangpur">Rangpur</option>
                    </select>
                  </div>
                </div>

                {/* Space Size */}
                <div>
                  <label htmlFor="spaceSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Available Space (sq ft)
                  </label>
                  <input
                    id="spaceSize"
                    name="spaceSize"
                    type="number"
                    value={formData.spaceSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter space in square feet"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary flex-1 py-3"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary flex-1 py-3"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Plants to Grow */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What would you like to grow? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Herbs', 'Vegetables', 'Fruits', 'Flowers'].map((plant) => (
                      <button
                        key={plant}
                        type="button"
                        onClick={() => handlePlantToggle(plant)}
                        className={`
                          p-3 border-2 rounded-lg text-center transition-all
                          ${formData.plants.includes(plant)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {plant}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Your gardening experience
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'beginner', label: 'Beginner - I\'m just starting out' },
                      { value: 'intermediate', label: 'Intermediate - I have some experience' },
                      { value: 'expert', label: 'Expert - I\'m an experienced gardener' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          value={option.value}
                          checked={formData.experience === option.value}
                          onChange={handleChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="#" className="text-green-600 hover:text-green-500">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="#" className="text-green-600 hover:text-green-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary flex-1 py-3"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 py-3"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Social Signup - Only show on first step */}
          {currentStep === 1 && (
            <>
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">Sign up with Google</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-medium">Sign up with Facebook</span>
                </button>
              </div>
            </>
          )}

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;