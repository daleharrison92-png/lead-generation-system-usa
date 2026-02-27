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

// Dashboard routes
router.get('/stats', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const scoredLeads = await Lead.countDocuments({ score: { $exists: true, $ne: null } });
    const highQualityLeads = await Lead.countDocuments({ score: { $gte: 25 } });
    const recentLeads = await Lead.countDocuments({ scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    const stats = {
      totalLeads,
      scoredLeads,
      highQualityLeads,
      recentLeads,
      scoringCoverage: Math.round((scoredLeads / totalLeads) * 100) || 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

router.get('/leads/quality', async (req, res) => {
  try {
    const leads = await Lead.aggregate([
      {
        $bucket: {
          groupBy: '$score',
          boundaries: [0, 10, 20, 30, 40, 50],
          default: '50+',
          output: {
            count: { $sum: 1 },
            averageScore: { $avg: '$score' }
          }
        }
      }
    ]);
    
    const qualityDistribution = leads.reduce((acc, bucket) => {
      const range = bucket._id === '50+' ? '50+' : `${bucket._id}-${bucket._id + 9}`;
      acc[range] = bucket.count;
      return acc;
    }, {});
    
    res.json({
      qualityDistribution,
      total: leads.reduce((sum, bucket) => sum + bucket.count, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get lead quality distribution' });
  }
});

router.get('/leads/trends', async (req, res) => {
  try {
    const trends = await Lead.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$scrapedAt'
            }
          },
          dailyCount: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get lead trends' });
  }
});

router.get('/industries/top', async (req, res) => {
  try {
    const topIndustries = await Lead.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 }, averageScore: { $avg: '$score' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(topIndustries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get top industries' });
  }
});

module.exports = router;