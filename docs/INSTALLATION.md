# Lead Generation System - Installation Guide

## Prerequisites

- Node.js 18+ or higher
- MongoDB 4.4+ or higher
- npm or yarn package manager

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd lead-generation-system
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Environment Variables

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/lead-generation
PORT=3000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
- `GOOGLE_MAPS_API_KEY`: Google Maps API key for location data

## Step 4: Set Up MongoDB

### Local MongoDB
1. Install MongoDB: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   ```bash
   mongod
   ```

### MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create new cluster
3. Get connection string from "Connect" button
4. Update `MONGODB_URI` in `.env`

## Step 5: Database Setup

### Create Database
```bash
# Connect to MongoDB
mongo

# Create database (optional, will auto-create)
use lead-generation
```

### Create Indexes (Optional)
```bash
# Connect to MongoDB
mongo

# Create indexes for better performance
use lead-generation

db.leads.createIndex({ companyName: 1 })
db.leads.createIndex({ score: -1 })
db.leads.createIndex({ scrapedAt: -1 })
```

## Step 6: Run Tests

```bash
npm test
```

This will verify that all components are working correctly.

## Step 7: Start the Application

### Development Mode
```bash
npm run start
```

### Production Mode
```bash
npm run start:prod
```

The server will start on `http://localhost:3000`

## Step 8: Verify Installation

Open your browser and navigate to:
- API Root: http://localhost:3000
- Dashboard: http://localhost:3000/api/dashboard/stats
- Analytics: http://localhost:3000/api/analytics/summary

## Step 9: Configure Cron Jobs (Optional)

### Nightly Automation
Add to your crontab for daily lead generation:

```bash
# Run nightly automation at 11:00 PM UTC
0 23 * * * cd /path/to/lead-generation-system && npm run nightly
```

### Manual Commands
```bash
# Run scraper manually
npm run scrape

# Run scoring manually
npm run score

# Generate daily report
npm run report
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB permissions

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Or kill the process using the port:
     ```bash
     lsof -ti:3000 | xargs kill -9
     ```

3. **Google Maps API Key**
   - Get API key from Google Cloud Console
   - Enable Places API
   - Set up billing account

4. **Permission Issues**
   - Ensure user has write permissions
   - Check file permissions: `chmod -R 755 .`

### Logs

Check application logs for debugging:
```bash
# Console logs
npm start

# Log file (if configured)
tail -f logs/app.log
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` file
   - Use secure secrets management

2. **API Security**
   - Consider adding authentication
   - Use HTTPS in production
   - Validate all inputs

3. **Database Security**
   - Use strong passwords
   - Enable MongoDB authentication
   - Restrict network access

## Performance Optimization

### Database Optimization
```bash
# Create indexes for common queries
use lead-generation
db.leads.createIndex({ industry: 1 })
db.leads.createIndex({ location: 1 })
db.leads.createIndex({ score: -1 })
```

### Memory Optimization
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

## Monitoring

### Application Metrics
- CPU usage
- Memory consumption
- Response times
- Error rates

### Database Metrics
- Connection pool size
- Query performance
- Index usage
- Storage usage

## Scaling

### Horizontal Scaling
- Deploy multiple instances
- Use load balancer
- Implement sticky sessions

### Database Scaling
- Replica sets
- Sharding
- Connection pooling

## Backup and Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --db lead-generation --out ./backups/$(date +%Y%m%d)
```

### Restore Backup
```bash
# MongoDB restore
mongorestore --db lead-generation ./backups/20231201/lead-generation/
```

## Support

For additional help:
- Check the documentation in `/docs`
- Review the API specifications
- Create an issue in the GitHub repository

## Next Steps

1. Configure your Google Maps API key
2. Set up automated testing
3. Implement monitoring
4. Schedule regular backups
5. Set up production deployment

Your lead generation system is now ready for use!