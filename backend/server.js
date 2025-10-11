import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // ✅ FIXED
  credentials: true
}));
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UrbanEos API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import Routes (✅ ALL routes imported, even if empty)
import authRoutes from './routes/auth.js';
import plantRoutes from './routes/plants.js';
import taskRoutes from './routes/tasks.js';
import diagnosisRoutes from './routes/diagnosis.js';
import weatherRoutes from './routes/weather.js';
import communityRoutes from './routes/community.js';
import quoteRoutes from './routes/quotes.js';

// API Routes (✅ ALL routes registered)
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/quotes', quoteRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000; // ✅ FIXED
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 UrbanEos API Server Started!`);
  console.log(`📡 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
});

export default app;