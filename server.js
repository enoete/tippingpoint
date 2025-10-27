const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3000;

let db;

// Initialize SQL.js database
async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Try to load existing database
  const dbPath = path.join(__dirname, 'farm.db');
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS poultry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      count INTEGER NOT NULL,
      eggs INTEGER DEFAULT 0,
      feed REAL DEFAULT 0,
      mortality INTEGER DEFAULT 0,
      batchName TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      crop TEXT NOT NULL,
      area REAL NOT NULL,
      stage TEXT,
      yield REAL DEFAULT 0,
      activities TEXT,
      cost REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS inputs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT,
      supplier TEXT,
      cost REAL DEFAULT 0,
      usedFor TEXT,
      currentStock REAL DEFAULT 0,
      minStock REAL DEFAULT 0,
      usageRate REAL DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Save database to disk
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(__dirname, 'farm.db'), buffer);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to run queries
function runQuery(sql, params = []) {
  try {
    db.run(sql, params);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Query error:', error);
    return { success: false, error: error.message };
  }
}

function getQuery(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

// ============ POULTRY ENDPOINTS ============
app.get('/api/poultry', (req, res) => {
  const { startDate, endDate, type, batchName } = req.query;
  let query = 'SELECT * FROM poultry WHERE 1=1';
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  if (batchName) {
    query += ' AND batchName = ?';
    params.push(batchName);
  }

  query += ' ORDER BY date DESC';

  const rows = getQuery(query, params);
  res.json(rows);
});

app.post('/api/poultry', (req, res) => {
  const { date, type, count, eggs, feed, mortality, batchName, notes } = req.body;
  
  const sql = `
    INSERT INTO poultry (date, type, count, eggs, feed, mortality, batchName, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = runQuery(sql, [date, type, count, eggs || 0, feed || 0, mortality || 0, batchName, notes]);
  
  if (result.success) {
    res.json({ message: 'Poultry record added successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.delete('/api/poultry/:id', (req, res) => {
  const result = runQuery('DELETE FROM poultry WHERE id = ?', [req.params.id]);
  if (result.success) {
    res.json({ message: 'Poultry record deleted successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// ============ CROPS ENDPOINTS ============
app.get('/api/crops', (req, res) => {
  const { startDate, endDate, crop, stage } = req.query;
  let query = 'SELECT * FROM crops WHERE 1=1';
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }
  if (crop) {
    query += ' AND crop = ?';
    params.push(crop);
  }
  if (stage) {
    query += ' AND stage = ?';
    params.push(stage);
  }

  query += ' ORDER BY date DESC';

  const rows = getQuery(query, params);
  res.json(rows);
});

app.post('/api/crops', (req, res) => {
  const { date, crop, area, stage, yield: cropYield, activities, cost } = req.body;
  
  const sql = `
    INSERT INTO crops (date, crop, area, stage, yield, activities, cost)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = runQuery(sql, [date, crop, area, stage, cropYield || 0, activities, cost || 0]);
  
  if (result.success) {
    res.json({ message: 'Crop record added successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.delete('/api/crops/:id', (req, res) => {
  const result = runQuery('DELETE FROM crops WHERE id = ?', [req.params.id]);
  if (result.success) {
    res.json({ message: 'Crop record deleted successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// ============ INPUTS ENDPOINTS ============
app.get('/api/inputs', (req, res) => {
  const { startDate, endDate, category, lowStock } = req.query;
  let query = 'SELECT * FROM inputs WHERE 1=1';
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (lowStock === 'true') {
    query += ' AND currentStock < minStock AND minStock > 0';
  }

  query += ' ORDER BY date DESC';

  const rows = getQuery(query, params);
  res.json(rows);
});

app.post('/api/inputs', (req, res) => {
  const { date, category, name, quantity, unit, supplier, cost, usedFor, currentStock, minStock, usageRate, notes } = req.body;
  
  const sql = `
    INSERT INTO inputs (date, category, name, quantity, unit, supplier, cost, usedFor, currentStock, minStock, usageRate, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = runQuery(sql, [date, category, name, quantity, unit, supplier, cost || 0, usedFor, currentStock || 0, minStock || 0, usageRate || 0, notes]);
  
  if (result.success) {
    res.json({ message: 'Input record added successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.put('/api/inputs/:id', (req, res) => {
  const { currentStock } = req.body;
  const result = runQuery('UPDATE inputs SET currentStock = ? WHERE id = ?', [currentStock, req.params.id]);
  
  if (result.success) {
    res.json({ message: 'Stock updated successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.delete('/api/inputs/:id', (req, res) => {
  const result = runQuery('DELETE FROM inputs WHERE id = ?', [req.params.id]);
  if (result.success) {
    res.json({ message: 'Input record deleted successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// ============ REPORTING ENDPOINTS ============
app.get('/api/reports/summary', (req, res) => {
  const poultryCount = getQuery('SELECT SUM(count) as total FROM poultry')[0] || { total: 0 };
  const totalEggs = getQuery('SELECT SUM(eggs) as total FROM poultry')[0] || { total: 0 };
  const totalCropArea = getQuery('SELECT SUM(area) as total FROM crops')[0] || { total: 0 };
  const totalInputsCost = getQuery('SELECT SUM(cost) as total FROM inputs')[0] || { total: 0 };
  const lowStockCount = getQuery('SELECT COUNT(*) as count FROM inputs WHERE currentStock < minStock AND minStock > 0')[0] || { count: 0 };

  res.json({
    totalPoultry: poultryCount.total || 0,
    totalEggs: totalEggs.total || 0,
    totalCropArea: totalCropArea.total || 0,
    totalInputsCost: totalInputsCost.total || 0,
    lowStockAlerts: lowStockCount.count || 0
  });
});

app.get('/api/reports/poultry-performance', (req, res) => {
  const { startDate, endDate } = req.query;
  let query = `
    SELECT 
      date,
      type,
      SUM(eggs) as totalEggs,
      SUM(feed) as totalFeed,
      SUM(mortality) as totalMortality,
      AVG(CAST(eggs AS FLOAT) / CAST(count AS FLOAT)) as eggPerBird
    FROM poultry
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' GROUP BY date, type ORDER BY date DESC';

  const rows = getQuery(query, params);
  res.json(rows);
});

app.get('/api/reports/inputs-by-category', (req, res) => {
  const rows = getQuery(`
    SELECT category, SUM(cost) as totalCost, COUNT(*) as count
    FROM inputs
    GROUP BY category
    ORDER BY totalCost DESC
  `);
  res.json(rows);
});

app.get('/api/reports/crop-costs', (req, res) => {
  const rows = getQuery(`
    SELECT crop, SUM(cost) as totalCost, SUM(area) as totalArea
    FROM crops
    GROUP BY crop
    ORDER BY totalCost DESC
  `);
  res.json(rows);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Farm Dashboard API is running' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🌾 Farm Dashboard Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Save database on exit
process.on('SIGINT', () => {
  saveDatabase();
  process.exit(0);
});
