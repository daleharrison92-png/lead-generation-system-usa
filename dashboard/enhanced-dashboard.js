const Lead = require('../scraper/index'); // Import Lead model
const advancedScoring = require('./advanced-scoring');

// Enhanced dashboard with predictive analytics
async function enhancedDashboard() {
  try {
    console.log('Generating enhanced dashboard insights...');
    
    // Get overall statistics
    const totalLeads = await Lead.countDocuments();
    const scoredLeads = await Lead.countDocuments({ score: { $exists: true, $ne: null } });
    const highQualityLeads = await Lead.countDocuments({ score: { $gte: 30 } });
    const recentLeads = await Lead.countDocuments({ scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    
    // Get quality distribution
    const qualityDistribution = await Lead.aggregate([
      {
        $bucket: {
          groupBy: '$score',
          boundaries: [0, 10, 20, 30, 40, 50, 60],
          default: '60+',
          output: {
            count: { $sum: 1 },
            percentage: { $avg: { $divide: [1, { $divide: ['$count', totalLeads] }] } }
          }
        }
      }
    ]);
    
    // Get industry insights
    const industryInsights = await Lead.aggregate([
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highQualityCount: {
            $sum: { $cond: [{ $gte: ['$score', 30] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get location insights
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
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Generate predictive insights
    const scoringCoverage = Math.round((scoredLeads / totalLeads) * 100) || 0;
    const highQualityPercentage = Math.round((highQualityLeads / totalLeads) * 100) || 0;
    const recentQualityRate = recentLeads > 0 ? Math.round((highQualityLeads / recentLeads) * 100) : 0;
    
    const insights = {
      // Overall metrics
      totalLeads,
      scoredLeads,
      scoringCoverage,
      highQualityLeads,
      highQualityPercentage,
      recentLeads,
      recentQualityRate,
      
      // Quality distribution
      qualityDistribution: qualityDistribution.reduce((acc, bucket) => {
        const range = bucket._id === '60+' ? '60+' : `${bucket._id}-${bucket._id + 9}`;
        acc[range] = {
          count: bucket.count,
          percentage: Math.round((bucket.count / totalLeads) * 100) || 0
        };
        return acc;
      }, {}),
      
      // Industry insights
      topIndustries: industryInsights.map(industry => ({
        industry: industry._id,
        count: industry.count,
        percentage: Math.round((industry.count / totalLeads) * 100) || 0,
        averageScore: industry.averageScore ? industry.averageScore.toFixed(2) : 'N/A',
        highQualityPercentage: Math.round((industry.highQualityCount / industry.count) * 100) || 0
      })),
      
      // Location insights
      topLocations: locationInsights.map(location => ({
        location: location._id,
        count: location.count,
        percentage: Math.round((location.count / totalLeads) * 100) || 0,
        averageScore: location.averageScore ? location.averageScore.toFixed(2) : 'N/A',
        highQualityPercentage: Math.round(location.highQualityPercentage * 100) || 0
      })),
      
      // Predictive insights
      growthPrediction: {
        nextWeekEstimate: Math.round(totalLeads * 1.15), // 15% growth estimate
        highQualityTarget: Math.round(highQualityLeads * 1.20) // 20% improvement target
      },
      
      // Recommendations
      recommendations: [
        {
          title: 'Improve Scoring Coverage',
          description: `Currently scoring ${scoringCoverage}% of leads. Aim for 100% coverage by running advanced scoring daily.`,
          priority: 'High',
          action: 'Run advanced scoring daily'
        },
        {
          title: 'Focus on High-Performing Industries',
          description: 'Industries with highest quality rates: ' + 
            industryInsights
              .filter(i => (i.highQualityCount / i.count) > 0.3)
              .map(i => i._id)
              .join(', '), // Industries with >30% high-quality rate
          priority: 'Medium',
          action: 'Prioritize outreach to top industries'
        },
        {
          title: 'Target Top Locations',
          description: 'Locations with highest quality rates: ' + 
            locationInsights
              .filter(l => l.highQualityPercentage > 30)
              .map(l => l._id)
              .join(', '), // Locations with >30% high-quality rate
          priority: 'Medium',
          action: 'Focus sourcing in top locations'
        },
        {
          title: 'Increase High-Quality Lead Generation',
          description: `Current high-quality rate: ${highQualityPercentage}%. Target: 40% by improving scoring criteria.`,
          priority: 'Low',
          action: 'Refine scoring algorithm'
        }
      ]
    };
    
    console.log('Enhanced dashboard insights generated successfully');
    return insights;
    
  } catch (error) {
    console.error('Error generating enhanced dashboard:', error);
    throw error;
  }
}

// Export for API use
module.exports = {
  enhancedDashboard
};

// Run enhanced dashboard if executed directly
if (require.main === module) {
  enhancedDashboard().then(insights => {
    console.log('Enhanced Dashboard Insights:');
    console.log(JSON.stringify(insights, null, 2));
  }).catch(error => {
    console.error('Enhanced dashboard failed:', error);
  });
}