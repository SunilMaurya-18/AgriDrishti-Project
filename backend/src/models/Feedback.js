const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'general'],
    default: 'general',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

feedbackSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
