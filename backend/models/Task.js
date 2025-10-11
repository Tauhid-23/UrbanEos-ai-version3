import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  plantName: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true
  },
  taskType: {
    type: String,
    enum: ['watering', 'fertilizing', 'pruning', 'pest-control', 'harvesting', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Anytime'],
    default: 'Anytime'
  },
  completedAt: Date,
  notes: String,
  reminder: {
    enabled: {
      type: Boolean,
      default: true
    },
    sentAt: Date
  },
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly']
    },
    nextOccurrence: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
