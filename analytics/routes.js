const express = require('express');
const mongoose = require('mongoose');
const Lead = require('../scraper/index'); // Import Lead model
require('dotenv').config();

const router = express.Router();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-generation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Analytics routes
router.get('/summary', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const scoredLeads = await Lead.countDocuments({ score: { $exists: true, $ne: null } });
    const highQualityLeads = await Lead.countDocuments({ score: { $gte: 25 } });
    const recentLeads = await Lead.countDocuments({ scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    const summary = {
      totalLeads,
      scoredLeads,
      highQualityLeads,
      recentLeads,
      scoringCoverage: Math.round((scoredLeads / totalLeads) * 100) || 0,
      highQualityPercentage: Math.round((highQualityLeads / totalLeads) * 100) || 0
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get analytics summary' });
  }
});

router.get('/quality-metrics', async (req, res) => {
  try {
    const metrics = await Lead.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          medianScore: { $median: '$score' },
          minScore: { $min: '$score' },
          maxScore: { $max: '$score' },
          stdDev: { $stdDevPop: '$score' }
        }
      }
    ]);
    
    res.json(metrics[0] || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quality metrics' });
  }
});

router.get('/growth', async (req, res) => {
  try {
    const growth = await Lead.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$scrapedAt'
            }
          },
          monthlyCount: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);
    
    res.json(growth);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get growth metrics' });
  }
});

router.get('/location-distribution', async (req, res) => {
  try {
    const distribution = await Lead.aggregate([
      {
        $group: {
          _id: {
            $arrayElemAt: [
              {
                $split: ['$location', ',']
              },
              1
          ]},
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get location distribution' });
  }
});

module.exports = router;