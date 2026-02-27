const { Lead, mongoose } = require('./test-utils');

describe('Lead Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-generation-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Lead.deleteMany({});
  });

  test('should create and save a lead', async () => {
    const lead = new Lead({
      companyName: 'Test Company',
      website: 'https://test.com',
      industry: 'Recruitment',
      location: 'New York, NY',
      employeeCount: 10,
      contactEmail: 'info@test.com',
      contactPhone: '123-456-7890'
    });

    await lead.save();

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

  test('should have default values', async () => {
    const lead = new Lead({
      companyName: 'Test Company'
    });

    await lead.save();

    expect(lead.score).toBe(0);
    expect(lead.scrapedAt).toBeDefined();
    expect(lead.scoredAt).toBeDefined();
  });

  test('should find leads by company name', async () => {
    await Lead.create({
      companyName: 'Company A',
      industry: 'Recruitment'
    });

    await Lead.create({
      companyName: 'Company B',
      industry: 'Recruitment'
    });

    const leads = await Lead.find({ industry: 'Recruitment' });
    expect(leads.length).toBe(2);
  });
});