const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Database = require('./database');
const goalRoutes = require('./routes/goals');
const categoryRoutes = require('./routes/categories');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');
const { NotificationManager } = require('./services/notifications');
const { CarryoverService } = require('./services/carryover');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Make database available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/goals', goalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Initialize services
const notificationManager = new NotificationManager(db);
const carryoverService = new CarryoverService(db);

// Start carryover service after database is ready (runs daily at midnight)
setTimeout(() => {
  carryoverService.start();
}, 2000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  carryoverService.stop();
  await db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Goal Manager Server running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized and ready`);
});

module.exports = app;