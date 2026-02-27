const mongoose = require('mongoose');

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

module.exports = { Lead, mongoose };