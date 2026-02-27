const Lead = require('../scraper/index');
const advancedScoring = require('../scoring/advanced-scoring');
const enhancedDashboard = require('../dashboard/enhanced-dashboard');
const advancedAnalytics = require('../analytics/advanced-analytics');
const generateReport = require('../reports/generate-daily-report');

async function main() {
  console.log('Lead Generation System - Nightly Automation');
  console.log('==========================================');
  
  try {
    // Step 1: Run enhanced scraping
    console.log('\n1. Running enhanced lead scraping...');
    const scrapeResult = await Lead.enhancedScraper();
    console.log(`Found ${scrapeResult} new leads`);
    
    // Step 2: Run advanced scoring
    console.log('\n2. Running advanced lead scoring...');
    const scoringResult = await advancedScoring.advancedLeadScoring();
    console.log(`Scored ${scoringResult} leads`);
    
    // Step 3: Generate enhanced dashboard insights
    console.log('\n3. Generating enhanced dashboard insights...');
    const dashboardInsights = await enhancedDashboard.enhancedDashboard();
    console.log('Dashboard insights generated');
    
    // Step 4: Run advanced analytics
    console.log('\n4. Running advanced analytics...');
    const analyticsInsights = await advancedAnalytics.advancedAnalytics();
    console.log('Analytics completed');
    
    // Step 5: Generate daily report
    console.log('\n5. Generating daily report...');
    const reportPath = await generateReport.generateDailyReport();
    console.log(`Daily report saved to: ${reportPath}`);
    
    // Step 6: Display summary
    console.log('\n=== Nightly Automation Summary ===');
    console.log(`Total Leads in Database: ${dashboardInsights.overallStats.totalLeads}`);
    console.log(`Scoring Coverage: ${dashboardInsights.overallStats.scoringCoverage}%`);
    console.log(`High-Quality Leads: ${dashboardInsights.overallStats.highQualityLeads} (${dashboardInsights.overallStats.highQualityPercentage}%)`);
    console.log(`New Leads Today: ${dashboardInsights.recentLeads}`);
    console.log(`Average Lead Score: ${dashboardInsights.overallStats.averageScore}`);
    
    // Step 7: Display top recommendations
    console.log('\n=== Top Recommendations ===');
    dashboardInsights.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.title}`);
      console.log(`   Priority: ${rec.priority}`);
      console.log(`   Action: ${rec.action}`);
      console.log(`   Description: ${rec.description.substring(0, 100)}...`);
    });
    
    console.log('\nNightly automation completed successfully!');
    
  } catch (error) {
    console.error('Nightly automation failed:', error);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
}