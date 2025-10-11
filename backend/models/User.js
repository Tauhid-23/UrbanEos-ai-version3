import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: function() {
      return this.fullName ? this.fullName.charAt(0).toUpperCase() : 'U';
    }
  },
  location: {
    city: String,
    division: String,
    district: String,
    area: String
  },
  gardenType: {
    type: String,
    enum: ['balcony', 'rooftop', 'indoor', 'backyard'],
    default: 'balcony'
  },
  spaceSize: String,
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'beginner'
  },
  plants: [String],
  level: {
    type: String,
    default: 'Budding Gardener'
  },
  points: {
    type: Number,
    default: 0
  },
  plantsGrown: {
    type: Number,
    default: 0
  },
  harvestsCompleted: {
    type: Number,
    default: 0
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update level based on points
userSchema.methods.updateLevel = function() {
  if (this.points < 500) this.level = 'Budding Gardener';
  else if (this.points < 1500) this.level = 'Growing Gardener';
  else if (this.points < 3000) this.level = 'Blooming Gardener';
  else if (this.points < 5000) this.level = 'Expert Gardener';
  else this.level = 'Master Gardener';
};

const User = mongoose.model('User', userSchema);

export default User;
