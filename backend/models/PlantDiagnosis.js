import mongoose from 'mongoose';

const plantDiagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  image: {
    type: String,
    required: true
  },
  diagnosisResult: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    issue: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Critical']
    },
    causes: [{
      cause: String,
      probability: Number
    }],
    treatment: [String],
    recovery: String,
    aiModel: String,
    processedAt: Date
  },
  userFeedback: {
    isAccurate: Boolean,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    feedbackAt: Date
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  error: String
}, {
  timestamps: true
});

// Indexes
plantDiagnosisSchema.index({ user: 1, createdAt: -1 });
plantDiagnosisSchema.index({ plant: 1 });

const PlantDiagnosis = mongoose.model('PlantDiagnosis', plantDiagnosisSchema);

export default PlantDiagnosis;
