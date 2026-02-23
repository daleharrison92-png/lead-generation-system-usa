const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const express = require('express');
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Express server for CRM dashboard
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for leads and analytics
const leads = [];
const analytics = {
  totalLeads: 0,
  scoredLeads: 0,
  averageScore: 0,
  categories: {
    high: 0,
    medium: 0,
    low: 0
  }
};

// Lead scoring criteria
const scoringCriteria = {
  employees: {
    '1-5': 3,
    '6-10': 2,
    '11-20': 1
  },
  industryRelevance: {
    'high': 5,
    'medium': 3,
    'low': 1
  },
  websiteQuality: {
    'professional': 4,
    'basic': 2,
    'poor': 1
  }
};

// Function to scrape recruitment agencies
async function scrapeRecruitmentAgencies() {
  console.log('Starting lead scraping...');
  
  try {
    // Example: Scraping from a directory of recruitment agencies
    const response = await axios.get('https://example-recruitment-directory.com/usa');
    const $ = cheerio.load(response.data);
    
    const agencyElements = $('.agency-listing');
    
    agencyElements.each((index, element) => {
      const agency = {
        name: $(element).find('.agency-name').text().trim(),
        url: $(element).find('.agency-url').attr('href'),
        employees: $(element).find('.employee-count').text().trim(),
        industry: $(element).find('.industry').text().trim(),
        location: $(element).find('.location').text().trim(),
        contact: $(element).find('.contact-info').text().trim(),
        score: 0,
        category: 'unscored',
        scrapedAt: new Date().toISOString()
      };
      
      // Only include agencies with 1-20 employees
      const employeeCount = parseInt(agency.employees);
      if (employeeCount >= 1 && employeeCount <= 20) {
        leads.push(agency);
      }
    });
    
    console.log(`Scraped ${agencyElements.length} agencies, ${leads.length} valid leads found`);
    
  } catch (error) {
    console.error('Error scraping agencies:', error.message);
  }
}

// Function to score leads
function scoreLeads() {
  console.log('Scoring leads...');
  
  leads.forEach(lead => {
    if (!lead.score) {
      let score = 0;
      
      // Score by employee count
      const employeeRange = getEmployeeRange(lead.employees);
      score += scoringCriteria.employees[employeeRange] || 1;
      
      // Score by industry relevance (mocked for now)
      const industryRelevance = getIndustryRelevance(lead.industry);
      score += scoringCriteria.industryRelevance[industryRelevance] || 1;
      
      // Score by website quality (mocked for now)
      const websiteQuality = getWebsiteQuality(lead.url);
      score += scoringCriteria.websiteQuality[websiteQuality] || 1;
      
      lead.score = score;
      lead.category = getCategory(score);
      
      analytics.scoredLeads++;
      analytics.averageScore = ((analytics.averageScore * (analytics.scoredLeads - 1)) + score) / analytics.scoredLeads;
      analytics.categories[lead.category]++;
    }
  });
  
  console.log('Leads scored successfully');
}

// Helper functions for scoring
function getEmployeeRange(employees) {
  const count = parseInt(employees);
  if (count >= 1 && count <= 5) return '1-5';
  if (count >= 6 && count <= 10) return '6-10';
  if (count >= 11 && count <= 20) return '11-20';
  return '1-5';
}

function getIndustryRelevance(industry) {
  const relevantIndustries = ['IT', 'Technology', 'Software', 'Engineering', 'Finance', 'Healthcare'];
  return relevantIndustries.some(rel => industry.toLowerCase().includes(rel.toLowerCase())) ? 'high' : 'medium';
}

function getWebsiteQuality(url) {
  // Mocked for now - in production, would analyze the actual website
  return 'professional';
}

function getCategory(score) {
  if (score >= 12) return 'high';
  if (score >= 8) return 'medium';
  return 'low';
}

// Function to generate daily summary report
function generateDailyReport() {
  console.log('Generating daily report...');
  
  const report = {
    date: new Date().toISOString(),
    totalLeads: leads.length,
    scoredLeads: analytics.scoredLeads,
    averageScore: analytics.averageScore,
    categories: { ...analytics.categories },
    newLeads: leads.filter(lead => new Date(lead.scrapedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)),
    summary: `Generated ${leads.length} leads, scored ${analytics.scoredLeads} leads with average score of ${analytics.averageScore.toFixed(2)}`
  };
  
  // Save report to file
  const reportPath = path.join(__dirname, 'reports', `daily-report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('Daily report generated:', reportPath);
  
  // Generate charts for dashboard
  generateCharts();
  
  return report;
}

// Function to generate charts for dashboard
function generateCharts() {
  console.log('Generating charts...');
  
  // Create leads by category chart
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  
  // Chart.js code would go here in a real implementation
  // For now, we'll just create a placeholder
  
  const chartPath = path.join(__dirname, 'charts', 'leads-by-category.png');
  fs.writeFileSync(chartPath, canvas.toBuffer('image/png'));
  
  console.log('Charts generated:', chartPath);
}

// Function to create CRM dashboard
app.get('/dashboard', (req, res) => {
  const dashboardData = {
    totalLeads: leads.length,
    scoredLeads: analytics.scoredLeads,
    averageScore: analytics.averageScore.toFixed(2),
    categories: analytics.categories,
    leads: leads.slice(0, 50) // Show first 50 leads
  };
  
  res.json(dashboardData);
});

app.get('/leads', (req, res) => {
  res.json(leads);
});

app.get('/analytics', (req, res) => {
  res.json(analytics);
});

// Cron job to run lead generation nightly
cron.schedule('0 0 * * *', () => {
  console.log('Nightly lead generation job started...');
  
  scrapeRecruitmentAgencies()
    .then(() => {
      scoreLeads();
      const report = generateDailyReport();
      console.log('Nightly job completed:', report.summary);
    })
    .catch(error => {
      console.error('Nightly job failed:', error.message);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Lead Generation System running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  - /dashboard - CRM dashboard');
  console.log('  - /leads - List all leads');
  console.log('  - /analytics - Analytics data');
});

console.log('Lead Generation System initialized');
console.log('Starting server...');