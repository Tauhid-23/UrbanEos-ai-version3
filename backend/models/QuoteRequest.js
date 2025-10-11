import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  plant: {
    name: {
      type: String,
      required: true
    },
    type: String,
    image: String
  },
  supplies: [{
    id: String,
    name: String,
    category: {
      type: String,
      enum: ['essential', 'optional']
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  contactInfo: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    division: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    postalCode: String,
    contactMethod: {
      type: String,
      enum: ['WhatsApp', 'Phone', 'Email'],
      default: 'WhatsApp'
    }
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'quoted', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  quotedAmount: Number,
  quotedAt: Date,
  respondedAt: Date,
  completedAt: Date,
  adminNotes: String
}, {
  timestamps: true
});

// Generate unique request ID
quoteRequestSchema.pre('save', function(next) {
  if (!this.requestId) {
    this.requestId = 'REQ' + Date.now().toString().slice(-8);
  }
  next();
});

// Indexes
quoteRequestSchema.index({ user: 1, createdAt: -1 });
quoteRequestSchema.index({ requestId: 1 });
quoteRequestSchema.index({ status: 1 });

const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);

export default QuoteRequest;
