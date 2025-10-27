# 🚀 Quick Start Guide - Farm Dashboard

## What You Have

A **complete full-stack farm management system** with:
- ✅ Backend database (SQLite)
- ✅ REST API (Node.js + Express)
- ✅ Multi-user support
- ✅ Filtering & reporting features
- ✅ Real-time data sync

## Files Overview

- `server.js` - Backend API server
- `public/index.html` - Frontend dashboard
- `package.json` - Dependencies list
- `farm.db` - Database (auto-created on first run)

---

## 🎯 FASTEST WAY: Deploy to Railway (FREE)

### Step 1: Push to GitHub
```bash
cd farm-dashboard-app
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `farm-dashboard-app` repository
5. Railway auto-detects Node.js and deploys!
6. You'll get a URL like: `https://farm-dashboard-production.railway.app`

**Done!** Share this URL with your team. Everyone can access it.

---

## 💻 Run Locally First (Recommended)

### Install and Run:
```bash
cd farm-dashboard-app
npm install
npm start
```

Open: http://localhost:3000

### Test from other devices on same WiFi:
1. Find your computer's IP address:
   - Mac/Linux: `ifconfig | grep inet`
   - Windows: `ipconfig`
2. From other devices, go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

---

## 🌐 Other Deployment Options

### Render (FREE)
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Build: `npm install`
5. Start: `node server.js`
6. Deploy!

### Heroku
```bash
heroku create farm-dashboard
git push heroku main
heroku open
```

### DigitalOcean App Platform
1. https://cloud.digitalocean.com/apps
2. Create App from GitHub
3. Select repo
4. Deploy (starts at $5/month)

---

## 📊 Using the Dashboard

### 1. **Overview Tab**
- See total stats across all operations
- View low stock alerts automatically

### 2. **Poultry Tab**
- Add bird counts, eggs collected, feed usage
- **Filter by**: Date range, type (Layers/Broilers), batch name
- Track mortality rates

### 3. **Crops Tab**
- Record crop activities and costs
- **Filter by**: Date range, crop name, growth stage
- Track area and yields

### 4. **Farm Inputs Tab**
- Manage inventory (fertilizers, pesticides, feed, etc.)
- Set minimum stock levels for alerts
- **Filter by**: Date, category, low stock only
- Track usage rates

### 5. **Reports Tab**
- View analytics and insights
- Egg production averages
- Cost breakdowns by category
- Poultry performance trends

---

## 🔧 Common Issues

### "Port 3000 already in use"
```bash
PORT=3001 npm start
```

### Can't connect from other devices
- Check firewall allows port 3000
- Make sure both devices are on same WiFi
- Use local IP, not "localhost"

### Database locked
- Only run one server instance
- Restart the server

---

## 💾 Backup Your Data

Your data is in `farm.db`. Back it up regularly:

```bash
cp farm.db backups/farm-$(date +%Y%m%d).db
```

---

## 🎓 Next Steps

1. **Deploy** to Railway/Render for cloud access
2. **Add users** - Everyone on your team can access the same URL
3. **Use filters** - Find specific records quickly
4. **Check reports** - Get insights from your data
5. **Set stock alerts** - Never run out of critical supplies

---

## 📞 Need Help?

- Check the main README.md for detailed docs
- API endpoints listed in README.md
- Test the `/api/health` endpoint to verify server is running

**Remember**: Once deployed, everyone on your team can access the same data from any device with the URL!
