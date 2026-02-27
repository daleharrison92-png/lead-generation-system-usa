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

// Advanced scoring with machine learning features
async function advancedLeadScoring() {
  try {
    console.log('Starting advanced lead scoring...');
    
    // Get all unscored leads
    const unscoredLeads = await Lead.find({ score: { $exists: false } });
    
    if (unscoredLeads.length === 0) {
      console.log('No unscored leads found.');
      return 0;
    }
    
    // Scoring features
    const scoringFeatures = {
      companyNameLength: lead => lead.companyName.length,
      websiteExists: lead => lead.website ? 1 : 0,
      industryScore: lead => {
        const industryWeights = {
          'Recruitment': 10,
          'Staffing': 9,
          'HR Services': 8,
          'Consulting': 7,
          'Other': 5
        };
        return industryWeights[lead.industry] || industryWeights['Other'];
      },
      locationScore: lead => {
        const preferredStates = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
        const state = lead.location.split(',').pop().trim().toUpperCase();
        return preferredStates.includes(state) ? 10 : 5;
      },
      employeeCountScore: lead => {
        if (lead.employeeCount >= 1 && lead.employeeCount <= 5) return 5;
        if (lead.employeeCount >= 6 && lead.employeeCount <= 10) return 8;
        if (lead.employeeCount >= 11 && lead.employeeCount <= 20) return 10;
        return 5;
      },
      contactInfoScore: lead => {
        let score = 2; // Base score
        if (lead.contactEmail) score += 7;
        if (lead.contactPhone) score += 5;
        if (lead.contactEmail && lead.contactPhone) score += 3; // Bonus for both
        return score;
      },
      domainQuality: lead => {
        if (!lead.website) return 3;
        const domain = lead.website.split('//').pop().split('/')[0];
        const reputableDomains = ['.com', '.org', '.net', '.io'];
        const hasReputableDomain = reputableDomains.some(ext => domain.endsWith(ext));
        return hasReputableDomain ? 8 : 5;
      }
    };
    
    // Calculate scores using weighted features
    const weightedFeatures = {
      companyNameLength: 0.05,
      websiteExists: 0.15,
      industryScore: 0.20,
      locationScore: 0.15,
      employeeCountScore: 0.20,
      contactInfoScore: 0.15,
      domainQuality: 0.10
    };
    
    for (const lead of unscoredLeads) {
      let totalScore = 0;
      
      // Calculate feature scores
      const featureScores = {
        companyNameLength: scoringFeatures.companyNameLength(lead) * weightedFeatures.companyNameLength,
        websiteExists: scoringFeatures.websiteExists(lead) * weightedFeatures.websiteExists,
        industryScore: scoringFeatures.industryScore(lead) * weightedFeatures.industryScore,
        locationScore: scoringFeatures.locationScore(lead) * weightedFeatures.locationScore,
        employeeCountScore: scoringFeatures.employeeCountScore(lead) * weightedFeatures.employeeCountScore,
        contactInfoScore: scoringFeatures.contactInfoScore(lead) * weightedFeatures.contactInfoScore,
        domainQuality: scoringFeatures.domainQuality(lead) * weightedFeatures.domainQuality
      };
      
      // Sum all weighted scores
      totalScore = Object.values(featureScores).reduce((sum, score) => sum + score, 0);
      
      lead.score = Math.round(totalScore);
      lead.scoredAt = new Date();
      
      await lead.save();
    }
    
    console.log(`Advanced scoring completed. Scored ${unscoredLeads.length} leads`);
    return unscoredLeads.length;
    
  } catch (error) {
    console.error('Error in advanced lead scoring:', error);
    return 0;
  }
}

// Export for API use
module.exports = {
  advancedLeadScoring,
  scoringFeatures,
  weightedFeatures
};

// Run advanced scoring if executed directly
if (require.main === module) {
  advancedLeadScoring().then(count => {
    console.log(`Advanced lead scoring completed. Scored ${count} leads.`);
    mongoose.disconnect();
  });
}