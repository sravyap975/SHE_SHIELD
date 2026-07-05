// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const sosRoutes = require('./routes/sosRoutes');
const reportRoutes = require('./routes/reportRoutes');
const aiRoutes = require('./routes/aiRoutes');
const nearbyRoutes = require('./routes/nearbyRoutes');
const userRoutes = require('./routes/userRoutes');
// Create the Express app
const app = express();

// Middleware - these run on every request before it reaches our routes
app.use(cors());              // Allows our React frontend to talk to this server
app.use(express.json({ limit: '10mb' }));      // Allows the server to understand JSON data sent from the frontend
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/nearby', nearbyRoutes);
app.use('/api/users', userRoutes);

// A simple test route to check if the server is working
app.get('/', (req, res) => {
  res.json({ message: 'She Shield backend is running successfully!' });
});

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});