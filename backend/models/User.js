const mongoose = require('mongoose');

// This schema defines the structure of a User document in MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // removes extra spaces
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // no two users can have the same email
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String, // will store the Cloudinary image URL
    default: '',
  },
  bloodGroup: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);