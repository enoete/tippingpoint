const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database('farm.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create tables if they don't exist
db.exec(`
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

  try {
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/poultry', (req, res) => {
  const { date, type, count, eggs, feed, mortality, batchName, notes } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO poultry (date, type, count, eggs, feed, mortality, batchName, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(date, type, count, eggs || 0, feed || 0, mortality || 0, batchName, notes);
    res.json({ id: result.lastInsertRowid, message: 'Poultry record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/poultry/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM poultry WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Poultry record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

  try {
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/crops', (req, res) => {
  const { date, crop, area, stage, yield: cropYield, activities, cost } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO crops (date, crop, area, stage, yield, activities, cost)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(date, crop, area, stage, cropYield || 0, activities, cost || 0);
    res.json({ id: result.lastInsertRowid, message: 'Crop record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/crops/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM crops WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Crop record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

  try {
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inputs', (req, res) => {
  const { date, category, name, quantity, unit, supplier, cost, usedFor, currentStock, minStock, usageRate, notes } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO inputs (date, category, name, quantity, unit, supplier, cost, usedFor, currentStock, minStock, usageRate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(date, category, name, quantity, unit, supplier, cost || 0, usedFor, currentStock || 0, minStock || 0, usageRate || 0, notes);
    res.json({ id: result.lastInsertRowid, message: 'Input record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/inputs/:id', (req, res) => {
  const { currentStock } = req.body;
  
  try {
    const stmt = db.prepare('UPDATE inputs SET currentStock = ? WHERE id = ?');
    stmt.run(currentStock, req.params.id);
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/inputs/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM inputs WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Input record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ REPORTING ENDPOINTS ============
app.get('/api/reports/summary', (req, res) => {
  try {
    const poultryCount = db.prepare('SELECT SUM(count) as total FROM poultry').get();
    const totalEggs = db.prepare('SELECT SUM(eggs) as total FROM poultry').get();
    const totalCropArea = db.prepare('SELECT SUM(area) as total FROM crops').get();
    const totalInputsCost = db.prepare('SELECT SUM(cost) as total FROM inputs').get();
    const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM inputs WHERE currentStock < minStock AND minStock > 0').get();

    res.json({
      totalPoultry: poultryCount.total || 0,
      totalEggs: totalEggs.total || 0,
      totalCropArea: totalCropArea.total || 0,
      totalInputsCost: totalInputsCost.total || 0,
      lowStockAlerts: lowStockCount.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

  try {
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/inputs-by-category', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT category, SUM(cost) as totalCost, COUNT(*) as count
      FROM inputs
      GROUP BY category
      ORDER BY totalCost DESC
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/crop-costs', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT crop, SUM(cost) as totalCost, SUM(area) as totalArea
      FROM crops
      GROUP BY crop
      ORDER BY totalCost DESC
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Farm Dashboard API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌾 Farm Dashboard Server running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
