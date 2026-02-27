const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-generation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Lead schema
const leadSchema = new mongoose.Schema({
  companyName: String,
  website: String,
  industry: String,
  location: String,
  employeeCount: Number,
  contactEmail: String,
  contactPhone: String,
  scrapedAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  scoredAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

// Advanced analytics with predictive modeling
async function advancedAnalytics() {
  try {
    console.log('Running advanced analytics...');
    
    // Get comprehensive statistics
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          scoredLeads: { $sum: { $cond: [{ $and: ['$score', { $ne: null }] }, 1, 0] } },
          highQualityLeads: { $sum: { $cond: [{ $gte: ['$score', 30] }, 1, 0] } },
          averageScore: { $avg: '$score' },
          medianScore: { $median: '$score' },
          stdDev: { $stdDevPop: '$score' },
          minScore: { $min: '$score' },
          maxScore: { $max: '$score' }
        }
      }
    ]);
    
    const overallStats = stats[0] || {};
    
    // Get time-based trends
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
          averageScore: { $avg: '$score' },
          highQualityCount: { $sum: { $cond: [{ $gte: ['$score', 30] }, 1, 0] } },
          scoringCoverage: {
            $avg: {
              $cond: [{ $and: ['$score', { $ne: null }] }, 1, 0]
            }
          }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);
    
    // Get industry trends
    const industryTrends = await Lead.aggregate([
      {
        $group: {
          _id: '$industry',
          totalCount: { $sum: 1 },
          scoredCount: {
            $sum: { $cond: [{ $and: ['$score', { $ne: null }] }, 1, 0] }
          },
          highQualityCount: { $sum: { $cond: [{ $gte: ['$score', 30] }, 1, 0] } },
          averageScore: { $avg: '$score' },
          growthRate: {
            $divide: [
              { $subtract: ['$totalCount', { $subtract: ['$totalCount', 1] }] },
              1
            ]
          }
        }
      },
      { $sort: { totalCount: -1 } },
      { $limit: 10 }
    ]);
    
    // Get location-based insights
    const locationInsights = await Lead.aggregate([
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
          averageScore: { $avg: '$score' },
          highQualityPercentage: {
            $avg: {
              $cond: [
                { $gte: ['$score', 30] },
                1,
                0
              ]
            }
          },
          growthTrend: {
            $avg: {
              $divide: [
                { $subtract: ['$count', { $subtract: ['$count', 1] }] },
                1
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Generate predictive insights
    const insights = {
      // Overall statistics
      overallStats: {
        totalLeads: overallStats.totalLeads || 0,
        scoredLeads: overallStats.scoredLeads || 0,
        scoringCoverage: overallStats.totalLeads > 0 ? 
          Math.round((overallStats.scoredLeads / overallStats.totalLeads) * 100) : 0,
        highQualityLeads: overallStats.highQualityLeads || 0,
        highQualityPercentage: overallStats.totalLeads > 0 ? 
          Math.round((overallStats.highQualityLeads / overallStats.totalLeads) * 100) : 0,
        averageScore: overallStats.averageScore ? overallStats.averageScore.toFixed(2) : 'N/A',
        medianScore: overallStats.medianScore ? overallStats.medianScore.toFixed(2) : 'N/A',
        stdDev: overallStats.stdDev ? overallStats.stdDev.toFixed(2) : 'N/A',
        minScore: overallStats.minScore || 'N/A',
        maxScore: overallStats.maxScore || 'N/A'
      },
      
      // Time-based trends
      trends: trends.map(trend => ({
        date: trend._id,
        dailyCount: trend.dailyCount,
        averageScore: trend.averageScore ? trend.averageScore.toFixed(2) : 'N/A',
        highQualityCount: trend.highQualityCount,
        highQualityPercentage: trend.dailyCount > 0 ? 
          Math.round((trend.highQualityCount / trend.dailyCount) * 100) : 0,
        scoringCoverage: Math.round(trend.scoringCoverage * 100) || 0
      })),
      
      // Industry insights
      industryInsights: industryTrends.map(industry => ({
        industry: industry._id,
        totalCount: industry.totalCount,
        scoredCount: industry.scoredCount,
        scoringCoverage: industry.totalCount > 0 ? 
          Math.round((industry.scoredCount / industry.totalCount) * 100) : 0,
        highQualityCount: industry.highQualityCount,
        highQualityPercentage: industry.totalCount > 0 ? 
          Math.round((industry.highQualityCount / industry.totalCount) * 100) : 0,
        averageScore: industry.averageScore ? industry.averageScore.toFixed(2) : 'N/A',
        growthRate: industry.growthRate ? industry.growthRate.toFixed(2) : 'N/A'
      })),
      
      // Location insights
      locationInsights: locationInsights.map(location => ({
        location: location._id,
        count: location.count,
        averageScore: location.averageScore ? location.averageScore.toFixed(2) : 'N/A',
        highQualityPercentage: Math.round(location.highQualityPercentage * 100),
        growthTrend: location.growthTrend ? location.growthTrend.toFixed(2) : 'N/A'
      })),
      
      // Predictive analytics
      predictions: {
        // Lead growth prediction
        nextWeekLeads: Math.round(overallStats.totalLeads * 1.15), // 15% weekly growth
        
        // Quality improvement prediction
        targetHighQuality: Math.round(overallStats.highQualityLeads * 1.20), // 20% improvement
        
        // Scoring coverage prediction
        targetScoringCoverage: Math.min(overallStats.scoredLeads > 0 ? 
          Math.round((overallStats.scoredLeads / overallStats.totalLeads) * 100) + 10 : 50, 100),
        
        // Industry performance prediction
        topPerformingIndustries: industryTrends
          .filter(industry => industry.highQualityPercentage > 30)
          .map(industry => industry._id),
        
        // Location performance prediction
        topPerformingLocations: locationInsights
          .filter(location => location.highQualityPercentage > 35)
          .map(location => location._id)
      },
      
      // Recommendations
      recommendations: [
        {
          title: 'Improve Scoring Coverage',
          description: `Current scoring coverage: ${insights.overallStats.scoringCoverage}%. Target: ${insights.predictions.targetScoringCoverage}% by running daily scoring jobs.`,
          priority: 'High',
          action: 'Schedule daily scoring job'
        },
        {
          title: 'Focus on High-Performing Industries',
          description: 'Target industries with highest quality rates: ' + 
            insights.predictions.topPerformingIndustries.join(', '), // Industries with >30% high-quality rate
          priority: 'Medium',
          action: 'Prioritize outreach to top industries'
        },
        {
          title: 'Target Top Locations',
          description: 'Focus on locations with highest quality rates: ' + 
            insights.predictions.topPerformingLocations.join(', '), // Locations with >35% high-quality rate
          priority: 'Medium',
          action: 'Source more leads from top locations'
        },
        {
          title: 'Increase High-Quality Lead Generation',
          description: `Current high-quality rate: ${insights.overallStats.highQualityPercentage}%. Target: 40% by improving scoring criteria.`,
          priority: 'Low',
          action: 'Refine scoring algorithm'
        },
        {
          title: 'Optimize Lead Growth',
          description: `Current lead growth rate: ${insights.predictions.nextWeekLeads - insights.overallStats.totalLeads} leads/week. Target: 15% weekly growth.`,
          priority: 'Medium',
          action: 'Increase scraping frequency'
        }
      ]
    };
    
    console.log('Advanced analytics completed successfully');
    return insights;
    
  } catch (error) {
    console.error('Error in advanced analytics:', error);
    throw error;
  }
}

// Export for API use
module.exports = {
  advancedAnalytics
};

// Run advanced analytics if executed directly
if (require.main === module) {
  advancedAnalytics().then(analytics => {
    console.log('Advanced Analytics Results:');
    console.log(JSON.stringify(analytics, null, 2));
  }).catch(error => {
    console.error('Advanced analytics failed:', error);
  });
}