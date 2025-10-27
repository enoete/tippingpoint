# Farm Management Dashboard 🌾

A full-stack farm management system with backend database, multi-user support, and advanced reporting features.

## Features

✅ **Multi-User Database** - SQLite backend for shared data access  
✅ **Real-time Sync** - All users see the same data instantly  
✅ **Advanced Filtering** - Filter by date range, type, category, etc.  
✅ **Comprehensive Reports** - Analytics and insights on farm operations  
✅ **Low Stock Alerts** - Automatic warnings for inventory items  
✅ **Data Persistence** - All data saved permanently in database  

## Tech Stack

- **Backend**: Node.js + Express + SQLite
- **Frontend**: Vanilla JavaScript (no frameworks needed!)
- **Database**: SQLite (file-based, easy to backup)

## Installation & Setup

### 1. Install Dependencies

```bash
cd farm-dashboard-app
npm install
```

### 2. Run the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Access the Dashboard

Open your browser and go to: `http://localhost:3000`

## Deployment Options

### Option 1: Railway (Recommended - FREE)

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js and deploy!
5. Your app will get a public URL like: `https://your-app.railway.app`

**Important**: Add this to your `package.json` if not already there:
```json
"scripts": {
  "start": "node server.js"
}
```

### Option 2: Render (FREE tier available)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click "Create Web Service"

### Option 3: Heroku

```bash
# Install Heroku CLI
# Then:
heroku login
heroku create your-farm-dashboard
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Select your repository
4. Deploy!

### Option 5: Local Network (For Farm Use)

If you want to run this on a local computer and access from multiple devices on the same network:

```bash
# Find your local IP address
# On Mac/Linux: ifconfig
# On Windows: ipconfig

# Then access from other devices:
http://YOUR_LOCAL_IP:3000
# Example: http://192.168.1.100:3000
```

## API Endpoints

### Poultry
- `GET /api/poultry` - Get all poultry records (with filters)
- `POST /api/poultry` - Add new poultry record
- `DELETE /api/poultry/:id` - Delete record

### Crops
- `GET /api/crops` - Get all crop records (with filters)
- `POST /api/crops` - Add new crop record
- `DELETE /api/crops/:id` - Delete record

### Inputs
- `GET /api/inputs` - Get all input records (with filters)
- `POST /api/inputs` - Add new input record
- `PUT /api/inputs/:id` - Update stock levels
- `DELETE /api/inputs/:id` - Delete record

### Reports
- `GET /api/reports/summary` - Overall farm summary
- `GET /api/reports/poultry-performance` - Poultry analytics
- `GET /api/reports/inputs-by-category` - Input spending breakdown
- `GET /api/reports/crop-costs` - Crop cost analysis

## Filter Examples

### Poultry Filters
- Date range: `?startDate=2025-01-01&endDate=2025-12-31`
- By type: `?type=Layers`
- By batch: `?batchName=Batch%20A`

### Crops Filters
- Date range: `?startDate=2025-01-01&endDate=2025-12-31`
- By crop: `?crop=Corn`
- By stage: `?stage=Growing`

### Inputs Filters
- Date range: `?startDate=2025-01-01&endDate=2025-12-31`
- By category: `?category=Fertilizer`
- Low stock only: `?lowStock=true`

## Database Backup

Your data is stored in `farm.db`. To backup:

```bash
# Copy the database file
cp farm.db farm-backup-$(date +%Y%m%d).db
```

## Troubleshooting

### Port already in use
```bash
# Change the port in server.js or set environment variable
PORT=3001 npm start
```

### Database locked
- Make sure only one instance of the server is running
- Restart the server

### Can't connect from other devices
- Make sure firewall allows connections on port 3000
- Use your computer's local IP address, not localhost

## Project Structure

```
farm-dashboard-app/
├── server.js           # Backend API server
├── package.json        # Dependencies
├── farm.db            # SQLite database (auto-created)
├── public/
│   └── index.html     # Frontend dashboard
└── README.md          # This file
```

## Development

To enable auto-restart on code changes:

```bash
npm install -g nodemon
nodemon server.js
```

## Support

For issues or questions, please create an issue on GitHub.

## License

MIT
