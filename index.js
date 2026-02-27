const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-generation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import routes
const scraperRoutes = require('./scraper/routes');
const scoringRoutes = require('./scoring/routes');
const dashboardRoutes = require('./dashboard/routes');
const analyticsRoutes = require('./analytics/routes');

// Use routes
app.use('/api/scraper', scraperRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Lead Generation System API',
    endpoints: [
      '/api/scraper',
      '/api/scoring',
      '/api/dashboard',
      '/api/analytics'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lead Generation System running on port ${PORT}`);
});