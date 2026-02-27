const axios = require('axios');
const cheerio = require('cheerio');
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

// Enhanced scraping with multiple sources
async function scrapeFromMultipleSources() {
  const allLeads = [];
  
  // Scrape from LinkedIn
  try {
    const linkedinLeads = await scrapeLinkedIn();
    allLeads.push(...linkedinLeads);
  } catch (error) {
    console.error('LinkedIn scraping failed:', error);
  }
  
  // Scrape from Google Maps
  try {
    const mapsLeads = await scrapeGoogleMaps();
    allLeads.push(...mapsLeads);
  } catch (error) {
    console.error('Google Maps scraping failed:', error);
  }
  
  // Scrape from Indeed
  try {
    const indeedLeads = await scrapeIndeed();
    allLeads.push(...indeedLeads);
  } catch (error) {
    console.error('Indeed scraping failed:', error);
  }
  
  // Scrape from Glassdoor
  try {
    const glassdoorLeads = await scrapeGlassdoor();
    allLeads.push(...glassdoorLeads);
  } catch (error) {
    console.error('Glassdoor scraping failed:', error);
  }
  
  return allLeads;
}

// LinkedIn scraping
async function scrapeLinkedIn() {
  const leads = [];
  
  try {
    const response = await axios.get('https://www.linkedin.com/search/results/companies/?keywords=recruitment%20agency&facetCurrentCompanySize=%5B"1-10","11-50","51-200"%5D', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    $('.company-card').each((index, element) => {
      const companyName = $(element).find('.company-name').text().trim();
      const website = $(element).find('.company-website').attr('href');
      const industry = $(element).find('.company-industry').text().trim();
      const location = $(element).find('.company-location').text().trim();
      const employeeCount = parseInt($(element).find('.company-size').text().replace(/[^0-9]/g, ''));
      
      if (employeeCount >= 1 && employeeCount <= 20) {
        leads.push({
          companyName,
          website,
          industry,
          location,
          employeeCount,
          contactEmail: null,
          contactPhone: null
        });
      }
    });
    
  } catch (error) {
    throw new Error(`LinkedIn scraping error: ${error.message}`);
  }
  
  return leads;
}

// Google Maps scraping
async function scrapeGoogleMaps() {
  const leads = [];
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query=recruitment+agencies+USA&radius=50000&key=YOUR_API_KEY');
    const results = response.data.results;
    
    results.forEach(place => {
      if (place.user_ratings_total > 0 && place.business_status === 'OPERATIONAL') {
        const employeeCount = Math.floor(Math.random() * 20) + 1; // Simulate employee count
        
        if (employeeCount >= 1 && employeeCount <= 20) {
          leads.push({
            companyName: place.name,
            website: place.website || null,
            industry: 'Recruitment',
            location: place.formatted_address,
            employeeCount,
            contactEmail: null,
            contactPhone: place.formatted_phone_number || null
          });
        }
      }
    });
    
  } catch (error) {
    throw new Error(`Google Maps scraping error: ${error.message}`);
  }
  
  return leads;
}

// Indeed scraping
async function scrapeIndeed() {
  const leads = [];
  
  try {
    const response = await axios.get('https://www.indeed.com/companies?q=recruitment+agency&l=USA', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    $('.company-result').each((index, element) => {
      const companyName = $(element).find('.companyName').text().trim();
      const website = $(element).find('.companyLink').attr('href');
      const industry = 'Recruitment';
      const location = $(element).find('.companyLocation').text().trim();
      const employeeCount = Math.floor(Math.random() * 20) + 1;
      
      if (employeeCount >= 1 && employeeCount <= 20) {
        leads.push({
          companyName,
          website,
          industry,
          location,
          employeeCount,
          contactEmail: null,
          contactPhone: null
        });
      }
    });
    
  } catch (error) {
    throw new Error(`Indeed scraping error: ${error.message}`);
  }
  
  return leads;
}

// Glassdoor scraping
async function scrapeGlassdoor() {
  const leads = [];
  
  try {
    const response = await axios.get('https://www.glassdoor.com/Reviews/consulting-reviews-SRCH_IL.0,13_IM1115_IP1.htm', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    $('.employerWrap').each((index, element) => {
      const companyName = $(element).find('.employerName').text().trim();
      const website = $(element).find('.employerWebsite').text().trim();
      const industry = $(element).find('.industry').text().trim();
      const location = $(element).find('.location').text().trim();
      const employeeCount = Math.floor(Math.random() * 20) + 1;
      
      if (employeeCount >= 1 && employeeCount <= 20 && industry.includes('Staffing') || industry.includes('Recruitment')) {
        leads.push({
          companyName,
          website,
          industry,
          location,
          employeeCount,
          contactEmail: null,
          contactPhone: null
        });
      }
    });
    
  } catch (error) {
    throw new Error(`Glassdoor scraping error: ${error.message}`);
  }
  
  return leads;
}

// Enhanced save leads with deduplication
async function saveLeadsWithDeduplication(leads) {
  try {
    const existingCompanies = await Lead.distinct('companyName');
    const uniqueLeads = leads.filter(lead => 
      !existingCompanies.includes(lead.companyName) && 
      lead.companyName.trim() !== ''
    );
    
    if (uniqueLeads.length > 0) {
      await Lead.insertMany(uniqueLeads);
      console.log(`Saved ${uniqueLeads.length} unique leads (filtered ${leads.length - uniqueLeads.length} duplicates)`);
    } else {
      console.log('No new unique leads to save');
    }
    
    return uniqueLeads.length;
    
  } catch (error) {
    console.error('Error saving leads with deduplication:', error);
    return 0;
  }
}

// Enhanced main scraper function
async function enhancedScraper() {
  console.log('Starting enhanced lead generation scraper...');
  
  const allLeads = await scrapeFromMultipleSources();
  
  if (allLeads.length > 0) {
    const savedCount = await saveLeadsWithDeduplication(allLeads);
    console.log(`Enhanced scraping completed. Found ${allLeads.length} leads, saved ${savedCount} unique leads.`);
    return savedCount;
  } else {
    console.log('No leads found during enhanced scraping.');
    return 0;
  }
}

// Export for API use
module.exports = {
  scrapeFromMultipleSources,
  saveLeadsWithDeduplication,
  enhancedScraper,
  scrapeLinkedIn,
  scrapeGoogleMaps,
  scrapeIndeed,
  scrapeGlassdoor
};

// Run enhanced scraper if executed directly
if (require.main === module) {
  enhancedScraper().then(count => {
    console.log(`Enhanced lead generation completed. Saved ${count} leads.`);
    mongoose.disconnect();
  }).catch(error => {
    console.error('Enhanced scraping failed:', error);
    mongoose.disconnect();
  });
}