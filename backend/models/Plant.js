import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Herb', 'Vegetable', 'Fruit', 'Flower', 'Other'],
    required: true
  },
  variety: String,
  image: {
    type: String,
    default: '🌱'
  },
  plantedDate: {
    type: Date,
    default: Date.now
  },
  expectedHarvestDate: Date,
  daysGrowing: {
    type: Number,
    default: 0
  },
  health: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  status: {
    type: String,
    enum: ['healthy', 'attention', 'sick', 'harvested', 'dead'],
    default: 'healthy'
  },
  location: {
    type: String,
    default: 'Garden'
  },
  careSchedule: {
    watering: {
      frequency: String,
      lastWatered: Date,
      nextWatering: Date
    },
    fertilizing: {
      frequency: String,
      lastFertilized: Date,
      nextFertilizing: Date
    },
    pruning: {
      frequency: String,
      lastPruned: Date
    }
  },
  notes: [{
    date: {
      type: Date,
      default: Date.now
    },
    content: String,
    type: {
      type: String,
      enum: ['observation', 'action', 'issue', 'harvest']
    }
  }],
  harvestLog: [{
    date: Date,
    quantity: Number,
    unit: String,
    quality: String,
    notes: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate days growing
plantSchema.pre('save', function(next) {
  if (this.plantedDate) {
    const daysDiff = Math.floor((Date.now() - this.plantedDate.getTime()) / (1000 * 60 * 60 * 24));
    this.daysGrowing = daysDiff;
  }
  next();
});

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
