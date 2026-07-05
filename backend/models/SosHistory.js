const mongoose = require('mongoose');

const sosHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: 'Address not available',
    },
  },
  status: {
    type: String,
    enum: ['triggered', 'resolved', 'cancelled'], // only these 3 values allowed
    default: 'triggered',
  },
  note: {
    type: String,
    default: '', // optional emergency note the user can add
  },
  contactsNotified: {
    type: Number,
    default: 0, // how many emergency contacts were alerted
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SosHistory', sosHistorySchema);