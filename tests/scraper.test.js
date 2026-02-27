const Lead = require('../scraper/index');

describe('Lead Scraper', () => {
  test('should have scraper methods', () => {
    expect(Lead).toHaveProperty('enhancedScraper');
    expect(Lead).toHaveProperty('scrapeFromMultipleSources');
    expect(Lead).toHaveProperty('scrapeLinkedIn');
    expect(Lead).toHaveProperty('scrapeGoogleMaps');
    expect(Lead).toHaveProperty('scrapeIndeed');
    expect(Lead).toHaveProperty('scrapeGlassdoor');
  });

  test('enhancedScraper should be a function', () => {
    expect(typeof Lead.enhancedScraper).toBe('function');
  });

  test('scrapeFromMultipleSources should be a function', () => {
    expect(typeof Lead.scrapeFromMultipleSources).toBe('function');
  });
});

describe('Lead Model', () => {
  test('Lead model should have correct schema', () => {
    const lead = new Lead.Lead({
      companyName: 'Test Company',
      website: 'https://test.com',
      industry: 'Recruitment',
      location: 'New York, NY',
      employeeCount: 10,
      contactEmail: 'info@test.com',
      contactPhone: '123-456-7890'
    });

    expect(lead.companyName).toBe('Test Company');
    expect(lead.website).toBe('https://test.com');
    expect(lead.industry).toBe('Recruitment');
    expect(lead.location).toBe('New York, NY');
    expect(lead.employeeCount).toBe(10);
    expect(lead.contactEmail).toBe('info@test.com');
    expect(lead.contactPhone).toBe('123-456-7890');
    expect(lead.scrapedAt).toBeDefined();
    expect(lead.score).toBe(0);
    expect(lead.scoredAt).toBeDefined();
  });
});