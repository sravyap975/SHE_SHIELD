const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Optional - only filled if NOT anonymous
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isAnonymous: {
    type: Boolean,
    default: true,
  },
  incidentType: {
    type: String,
    enum: ['harassment', 'stalking', 'unsafe_area', 'assault', 'suspicious_activity', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: {
      type: String,
      default: 'Location not specified',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);