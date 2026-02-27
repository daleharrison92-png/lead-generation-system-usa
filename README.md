# Lead Generation System

Automated lead generation system for USA recruitment agencies (1-20 employees) with lead scoring, CRM dashboard, and analytics.

## Features

- **Automated Lead Scraper**: Multi-source scraping from LinkedIn, Google Maps, Indeed, and Glassdoor
- **Lead Scoring System**: Advanced scoring algorithm with 7 weighted criteria
- **CRM Dashboard**: Real-time statistics, quality distribution, and trends
- **Analytics Engine**: Predictive analytics with growth forecasts and recommendations
- **Daily Reports**: Automated summary reports with quality insights
- **No Automated Outreach**: Compliant with data privacy regulations

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd lead-generation-system
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Configuration

Create a `.env` file with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/lead-generation
PORT=3000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Usage

### Starting the API Server

```bash
npm start
```

### Running the Scraper

```bash
npm run scrape
```

### Running Advanced Scoring

```bash
npm run score
```

### Generating Daily Reports

```bash
npm run report
```

### Running Tests

```bash
npm test
```

### Nightly Automation

```bash
npm run nightly
```

## API Endpoints

### Scraper API
- `GET /api/scraper/stats` - Get scraper statistics
- `POST /api/scraper/run` - Run the scraper

### Scoring API
- `GET /api/scoring/stats` - Get scoring statistics
- `POST /api/scoring/run` - Run scoring on unscored leads
- `GET /api/scoring/top` - Get top scored leads

### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/quality` - Get lead quality distribution
- `GET /api/dashboard/trends` - Get lead trends
- `GET /api/dashboard/industries` - Get top industries

### Analytics API
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/quality` - Get quality metrics
- `GET /api/analytics/growth` - Get growth metrics
- `GET /api/analytics/locations` - Get location distribution

## Lead Scoring Criteria

The system uses a weighted scoring algorithm with 7 criteria:

| Criteria | Weight | Score Range |
|----------|--------|-------------|
| Employee Count | 20% | 1-10 points |
| Industry | 20% | 5-10 points |
| Location | 15% | 5-10 points |
| Website Quality | 15% | 3-8 points |
| Contact Information | 15% | 2-10 points |
| Company Name Length | 5% | 1-10 points |
| Domain Quality | 10% | 3-8 points |

**High-Quality Lead**: Score ≥ 30 points

## Data Sources

1. **LinkedIn**: Company profiles and professional data
2. **Google Maps**: Business listings and locations
3. **Indeed**: Company reviews and information
4. **Glassdoor**: Company insights and employee data

## Report Format

Daily reports are generated in Markdown format with:
- Overview statistics
- Today's new leads
- Quality insights
- Scoring trends
- Recommendations

## Compliance

- No automated outreach included
- GDPR and CCPA compliant data handling
- Opt-in data collection only
- Transparent scoring methodology

## Development

### Project Structure
```
lead-generation-system/
├── scraper/           # Lead scraping functionality
├── scoring/          # Lead scoring algorithms
├── dashboard/        # Real-time dashboard
├── analytics/        # Advanced analytics
├── reports/          # Report generation
├── tests/            # Test files
└── docs/             # Documentation
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the API specifications