module.exports = {
  enhancedScraper: require('./enhanced-scraper'),
  saveLeadsWithDeduplication: require('./enhanced-scraper').saveLeadsWithDeduplication,
  scrapeFromMultipleSources: require('./enhanced-scraper').scrapeFromMultipleSources,
  scrapeLinkedIn: require('./enhanced-scraper').scrapeLinkedIn,
  scrapeGoogleMaps: require('./enhanced-scraper').scrapeGoogleMaps,
  scrapeIndeed: require('./enhanced-scraper').scrapeIndeed,
  scrapeGlassdoor: require('./enhanced-scraper').scrapeGlassdoor
};