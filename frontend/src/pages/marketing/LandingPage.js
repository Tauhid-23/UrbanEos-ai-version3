import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Check, 
  Star, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Award,
  Sprout,
  Clock,
  Target,
  Shield,
  Play
} from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';
import { mockTestimonials, mockStats, mockFeatures } from '../../data/mock';
import { AnimatedCounter } from '../../hooks/useCountUp';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate('/signup', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <h1 className="heading-1 mb-6">
                Transform Your Balcony Into a 
                <span className="text-green-600"> Thriving Garden</span> 🌱
              </h1>
              
              <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
                Join 10,000+ urban gardeners in Bangladesh growing their own food with 
                personalized care plans, AI plant diagnosis, and expert community support
              </p>

              {/* Value Propositions */}
              <div className="space-y-3 mb-8 text-left">
                {[
                  'AI plant diagnosis in seconds',
                  'Personalized care reminders',
                  'Expert community of 10,000+ gardeners',
                  'Perfect for balconies & rooftops'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="body-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="max-w-md mx-auto lg:mx-0">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to get started"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      className="btn-primary whitespace-nowrap px-8"
                    >
                      Start Growing Free
                    </button>
                  </div>
                </form>
                
                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-500">No credit card required • 2-minute setup</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex -space-x-2">
                      {['🧑‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍🌾'].map((avatar, i) => (
                        <div key={i} className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm border-2 border-white">
                          {avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Join 10,000+ gardeners</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 relative overflow-hidden">
                <div className="text-center">
                  <div className="text-8xl mb-4">🏡</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Your Garden Awaits</h3>
                  <p className="text-green-700">Beautiful balcony & rooftop gardens</p>
                </div>
                
                {/* Floating Stats Cards */}
                <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50K+</div>
                    <div className="text-xs text-gray-600">Plants Growing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Trusted by Urban Gardeners Across Bangladesh</h2>
          </div>
          
          {/* Statistics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: Users, stat: mockStats.totalGardeners, label: 'Active Gardeners' },
              { icon: Sprout, stat: mockStats.plantsGrowing, label: 'Plants Growing' },
              { icon: Star, stat: mockStats.averageRating, label: 'Average Rating' },
              { icon: TrendingUp, stat: mockStats.successRate, label: 'Success Rate' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</div>
                  <div className="text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div>

          {/* Testimonials */}
          <div className="grid lg:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="product-card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location} • {testimonial.gardenType}</div>
                  <div className="text-xs text-gray-500 mt-1">Using UrbanEos for {testimonial.usingFor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Urban Gardening Made Simple</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              We solve the challenges that stop people from growing their own food
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                problem: "Not sure what plants will grow in your space?",
                solution: "AI recommends perfect plants for your balcony/roof based on space, sunlight, and climate",
                icon: "❓"
              },
              {
                problem: "Forget watering schedules and care routines?",
                solution: "Smart reminders adapt to weather conditions and plant needs automatically",
                icon: "📅"
              },
              {
                problem: "Plants getting sick and you don't know why?",
                solution: "Instant AI diagnosis with photo upload - identify diseases and get treatment plans in seconds",
                icon: "🐛"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-6">{item.icon}</div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium">{item.problem}</p>
                </div>
                <ArrowRight className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Everything You Need to Succeed</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              From planting to harvest, we've got you covered
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {mockFeatures.slice(0, 6).map((feature) => (
              <div key={feature.id} className="product-card">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Get Started in 3 Easy Steps</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: "Tell Us About Your Space",
                description: "Answer 5 quick questions about your balcony or roof garden - takes just 2 minutes",
                duration: "2 min",
                icon: "📋"
              },
              {
                step: 2,
                title: "Get AI Plant Recommendations",
                description: "Our AI suggests plants perfect for your space, experience level, and climate",
                duration: "5 min",
                icon: "🎯"
              },
              {
                step: 3,
                title: "Follow Personalized Care Plans",
                description: "Get daily tasks, weather alerts, and expert advice. Watch your garden thrive!",
                duration: "Ongoing",
                icon: "🌾"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {item.duration}
                  </div>
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="h-6 w-6 text-green-600 mx-auto" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Your Garden Journey →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Urban Garden?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ gardeners growing fresh food at home
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>100% Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;