# Lead Generation System - API Documentation

Comprehensive API documentation for the lead generation system.

## Base URL

```
http://localhost:3000
```

## Authentication

This API does not currently implement authentication. All endpoints are publicly accessible.

## Response Format

All responses are in JSON format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message"
}
```

## Error Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "Error code"
}
```

## Scraper API

### Get Scraper Statistics

```
GET /api/scraper/stats
```

**Response:**
```json
{
  "totalLeads": 1234,
  "newLeadsToday": 56,
  "lastScraped": "2024-01-15T10:30:00.000Z",
  "sources": {
    "linkedin": 300,
    "googleMaps": 400,
    "indeed": 250,
    "glassdoor": 200
  }
}
```

### Run Scraper

```
POST /api/scraper/run
```

**Request Body:**
```json
{
  "sources": ["linkedin", "googleMaps", "indeed", "glassdoor"],
  "maxLeads": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scraping completed successfully",
  "stats": {
    "totalScraped": 85,
    "uniqueLeads": 78,
    "duplicates": 7
  }
}
```

## Scoring API

### Get Scoring Statistics

```
GET /api/scoring/stats
```

**Response:**
```json
{
  "totalLeads": 1234,
  "scoredLeads": 1100,
  "scoringCoverage": 89.2,
  "averageScore": 28.5,
  "highQualityLeads": 345,
  "highQualityPercentage": 28.0
}
```

### Run Scoring

```
POST /api/scoring/run
```

**Request Body:**
```json
{
  "force": false,
  "batchSize": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scoring completed successfully",
  "stats": {
    "leadsScored": 100,
    "averageScore": 29.2,
    "newHighQuality": 25
  }
}
```

### Get Top Scored Leads

```
GET /api/scoring/top?limit=10
```

**Response:**
```json
{
  "leads": [
    {
      "companyName": "Top Recruitment Agency",
      "score": 45,
      "industry": "Recruitment",
      "location": "New York, NY",
      "employeeCount": 15,
      "website": "https://topagency.com",
      "contactEmail": "info@topagency.com",
      "contactPhone": "212-555-0123"
    }
  ]
}
```

## Dashboard API

### Get Dashboard Statistics

```
GET /api/dashboard/stats
```

**Response:**
```json
{
  "totalLeads": 1234,
  "scoredLeads": 1100,
  "scoringCoverage": 89.2,
  "highQualityLeads": 345,
  "highQualityPercentage": 28.0,
  "newLeadsToday": 56,
  "averageScore": 28.5,
  "medianScore": 27.0
}
```

### Get Lead Quality Distribution

```
GET /api/dashboard/quality
```

**Response:**
```json
{
  "qualityDistribution": {
    "0-9": 45,
    "10-19": 120,
    "20-29": 300,
    "30-39": 400,
    "40-49": 250,
    "50+": 119
  },
  "totalLeads": 1234
}
```

### Get Lead Trends

```
GET /api/dashboard/trends
```

**Response:**
```json
[
  {
    "date": "2024-01-14",
    "dailyCount": 45,
    "averageScore": 27.8,
    "highQualityCount": 12,
    "highQualityPercentage": 26.7
  }
]
```

### Get Top Industries

```
GET /api/dashboard/industries
```

**Response:**
```json
[
  {
    "industry": "Recruitment",
    "count": 800,
    "percentage": 64.8,
    "averageScore": 29.5,
    "highQualityCount": 280,
    "highQualityPercentage": 35.0
  }
]
```

## Analytics API

### Get Analytics Summary

```
GET /api/analytics/summary
```

**Response:**
```json
{
  "overallStats": {
    "totalLeads": 1234,
    "scoredLeads": 1100,
    "scoringCoverage": 89.2,
    "highQualityLeads": 345,
    "highQualityPercentage": 28.0,
    "averageScore": 28.5,
    "medianScore": 27.0,
    "stdDev": 8.2,
    "minScore": 5,
    "maxScore": 48
  },
  "predictions": {
    "nextWeekLeads": 1420,
    "targetHighQuality": 410,
    "targetScoringCoverage": 95,
    "topPerformingIndustries": ["Recruitment", "Staffing", "HR Services"],
    "topPerformingLocations": ["California", "New York", "Texas"]
  }
}
```

### Get Quality Metrics

```
GET /api/analytics/quality
```

**Response:**
```json
{
  "averageScore": 28.5,
  "medianScore": 27.0,
  "stdDev": 8.2,
  "minScore": 5,
  "maxScore": 48,
  "scoreRange": {
    "0-20": 365,
    "21-40": 500,
    "41-60": 369
  }
}
```

### Get Growth Metrics

```
GET /api/analytics/growth
```

**Response:**
```json
[
  {
    "month": "2024-01",
    "monthlyCount": 1234,
    "averageScore": 28.5,
    "growthRate": 15.2
  }
]
```

### Get Location Distribution

```
GET /api/analytics/locations
```

**Response:**
```json
[
  {
    "location": "California",
    "count": 300,
    "percentage": 24.3,
    "averageScore": 29.8,
    "highQualityPercentage": 32.3
  }
]
```

## Lead Scoring Criteria

### Scoring Algorithm

```
POST /api/scoring/criteria
```

**Request Body:**
```json
{
  "companyName": "Test Company",
  "website": "https://test.com",
  "industry": "Recruitment",
  "location": "New York, NY",
  "employeeCount": 10,
  "contactEmail": "info@test.com",
  "contactPhone": "123-456-7890"
}
```

**Response:**
```json
{
  "score": 38,
  "breakdown": {
    "companyNameLength": 6,
    "websiteExists": 8,
    "industryScore": 10,
    "locationScore": 8,
    "employeeCountScore": 8,
    "contactInfoScore": 8,
    "domainQuality": 6
  }
}
```

## Webhook API

### Lead Created Webhook

```
POST /api/webhooks/lead-created
```

**Request Body:**
```json
{
  "lead": {
    "companyName": "New Company",
    "score": 35,
    "industry": "Recruitment",
    "location": "Texas",
    "scrapedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

## Rate Limiting

- **Unauthenticated requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour
- **Burst limit**: 10 requests per minute

## CORS

CORS is enabled for all origins. For production, restrict to specific domains.

## Versioning

API versions are included in the URL path:

```
GET /api/v1/scraper/stats
```

## Changelog

### v1.0.0
- Initial release
- Complete lead generation API
- Scoring and analytics endpoints
- Dashboard statistics

### v1.1.0
- Added webhook support
- Enhanced error handling
- Rate limiting implementation

## Support

For API support:
- Check the documentation in `/docs`
- Review the API specifications
- Create an issue in the GitHub repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This API is licensed under the MIT License - see the LICENSE file for details.