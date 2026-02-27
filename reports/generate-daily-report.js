const fs = require('fs');
const path = require('path');

// Generate daily lead summary report
function generateDailyReport() {
  try {
    console.log('Generating daily lead summary report...');
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Load existing leads data
    let leads = [];
    const dataPath = path.join(__dirname, '../clawd/lead-generation/leads.json');
    
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      const jsonData = JSON.parse(data.replace(/^#.*$/gm, '').trim());
      leads = jsonData;
    } catch (error) {
      console.log('No existing lead data found');
    }
    
    // Filter today's leads
    const todayLeads = leads.filter(lead => {
      const scrapedDate = new Date(lead.scraped_at || lead.scrapedAt || today);
      scrapedDate.setHours(0, 0, 0, 0);
      return scrapedDate.getTime() === today.getTime();
    });
    
    // Get overall stats
    const totalLeads = leads.length;
    const scoredLeads = leads.filter(lead => lead.score || lead.qualification_score).length;
    const highQualityLeads = leads.filter(lead => 
      (lead.score || 0) >= 25 || 
      (lead.qualification_score || 0) >= 25
    ).length;
    
    // Generate report content
    let report = `# Daily Lead Generation Summary - ${today.toDateString()}\n\n`;
    
    report += `## Overview\n`;
    report += `- **Total Leads in Database:** ${totalLeads.toLocaleString()}\n`;
    report += `- **Leads Scored:** ${scoredLeads.toLocaleString()} (${Math.round((scoredLeads / totalLeads) * 100) || 0}%)
`;
    report += `- **High-Quality Leads (≥ 25 points):** ${highQualityLeads.toLocaleString()} (${Math.round((highQualityLeads / totalLeads) * 100) || 0}%)
`;
    report += `- **New Leads Today:** ${todayLeads.length.toLocaleString()}\n\n`;
    
    report += `## Today's New Leads (${todayLeads.length} leads)\n\n`;
    
    if (todayLeads.length > 0) {
      todayLeads.forEach((lead, index) => {
        report += `${index + 1}. **${lead.company_name || lead.companyName}**\n`;
        report += `   - Industry: ${lead.industry || 'N/A'}\n`;
        report += `   - Employees: ${lead.employee_count || lead.employeeCount || 'N/A'}\n`;
        report += `   - Revenue: ${lead.revenue_range || lead.revenue || 'N/A'}\n`;
        report += `   - Score: ${lead.score || lead.qualification_score || 'Not Scored'}\n`;
        report += `   - Contact: ${lead.contact_info?.email || lead.contactEmail || 'N/A'}\n\n`;
      });
    } else {
      report += 'No new leads were generated today.\n\n';
    }
    
    // Add quality insights
    report += `## Quality Insights\n\n`;
    
    if (todayLeads.length > 0) {
      const scores = todayLeads.map(lead => lead.score || lead.qualification_score || 0);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highScoreCount = scores.filter(score => score >= 25).length;
      
      report += `- **Average Score of Today's Leads:** ${avgScore.toFixed(2)}\n`;
      report += `- **High-Quality Leads Today:** ${highScoreCount} (${Math.round((highScoreCount / todayLeads.length) * 100) || 0}%)
\n`;
    }
    
    // Save report
    const reportDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, `daily-report-${today.toISOString().split('T')[0]}.md`);
    fs.writeFileSync(reportPath, report);
    
    console.log(`Daily report generated: ${reportPath}`);
    
    return reportPath;
    
  } catch (error) {
    console.error('Error generating daily report:', error);
    throw error;
  }
}

// Export for API use
module.exports = {
  generateDailyReport
};

// Run report generation if executed directly
if (require.main === module) {
  generateDailyReport().then(reportPath => {
    console.log(`Daily report completed: ${reportPath}`);
  }).catch(error => {
    console.error('Report generation failed:', error);
  });
}