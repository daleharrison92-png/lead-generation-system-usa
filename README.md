# Lead Generation System

An automated lead generation system for USA recruitment agencies (1-20 employees) with lead scoring, CRM dashboard, and analytics.

## Features

- **Automated Lead Scraper**: Scrapes recruitment agencies from directories
- **Lead Scoring System**: Scores leads based on employee count, industry relevance, and website quality
- **CRM Dashboard**: Real-time dashboard with Express.js
- **Analytics**: Comprehensive analytics and reporting
- **Daily Reports**: Automated daily summary reports

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

The system will start scraping leads nightly at midnight UTC and provide the following endpoints:

- `GET /dashboard` - CRM dashboard data
- `GET /leads` - List all leads
- `GET /analytics` - Analytics data

## Lead Scoring Criteria

Leads are scored based on:
- **Employee Count**: 1-5 (3 pts), 6-10 (2 pts), 11-20 (1 pt)
- **Industry Relevance**: High (5 pts), Medium (3 pts), Low (1 pt)
- **Website Quality**: Professional (4 pts), Basic (2 pts), Poor (1 pt)

## Categories

- **High**: Score >= 12
- **Medium**: Score >= 8
- **Low**: Score < 8

## Daily Reports

Daily reports are generated automatically and saved in the `reports/` directory with JSON format containing:
- Total leads generated
- Scored leads
- Average score
- Category breakdown
- New leads summary