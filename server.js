// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const hotelConfig = require('./config/hotelConfig');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint to identify which hotel
app.use('/api', (req, res, next) => {
  const hotelId = req.query.hotelId || req.headers['x-hotel-id'];
  
  if (!hotelId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Hotel ID is required in query parameter or header' 
    });
  }
  
  const hotel = hotelConfig.getHotelById(hotelId);
  if (!hotel) {
    return res.status(404).json({ 
      success: false, 
      message: 'Hotel not found' 
    });
  }
  
  req.hotel = hotel;
  next();
});

// Use routes
app.use('/api', routes);

// Home page
app.get('/', (req, res) => {
  res.send('Welcome to Keepsty Multi-Hotel Backend API!');
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Default connection for admin purposes
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas (Admin Connection)');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  }
};

startServer();
   