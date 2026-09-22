const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { getDb } = require('../../config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization middleware for Netlify Function execution
app.use(async (req, res, next) => {
  try {
    await getDb();
    next();
  } catch (err) {
    console.error('Netlify Function DB Connect Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Import API Routes
const authRoutes = require('../../routes/authRoutes');
const adminRoutes = require('../../routes/adminRoutes');
const roomRoutes = require('../../routes/roomRoutes');
const paymentRoutes = require('../../routes/paymentRoutes');
const reportRoutes = require('../../routes/reportRoutes');
const reminderRoutes = require('../../routes/reminderRoutes');
const notificationRoutes = require('../../routes/notificationRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/rooms', roomRoutes);
app.use('/payments', paymentRoutes);
app.use('/reports', reportRoutes);
app.use('/reminders', reminderRoutes);
app.use('/notifications', notificationRoutes);

// Catch unmatched API routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Global error handler - guarantees JSON responses
app.use((err, req, res, next) => {
  console.error('Netlify Function Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports.handler = serverless(app);
