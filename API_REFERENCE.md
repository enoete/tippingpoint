# API Reference - Farm Dashboard

Base URL: `http://localhost:3000` (or your deployed URL)

---

## 🐔 Poultry Endpoints

### Get All Poultry Records
```
GET /api/poultry
```

**Query Parameters:**
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `type` - Filter by type (Layers/Broilers)
- `batchName` - Filter by batch name

**Example:**
```
GET /api/poultry?startDate=2025-01-01&type=Layers
```

**Response:**
```json
[
  {
    "id": 1,
    "date": "2025-10-01",
    "type": "Layers",
    "count": 500,
    "eggs": 450,
    "feed": 75,
    "mortality": 2,
    "batchName": "Batch A",
    "notes": "Regular production",
    "created_at": "2025-10-01 10:30:00"
  }
]
```

### Add Poultry Record
```
POST /api/poultry
Content-Type: application/json
```

**Body:**
```json
{
  "date": "2025-10-26",
  "type": "Layers",
  "count": 500,
  "eggs": 450,
  "feed": 75,
  "mortality": 2,
  "batchName": "Batch A",
  "notes": "Regular production"
}
```

**Response:**
```json
{
  "id": 5,
  "message": "Poultry record added successfully"
}
```

### Delete Poultry Record
```
DELETE /api/poultry/:id
```

---

## 🌾 Crops Endpoints

### Get All Crop Records
```
GET /api/crops
```

**Query Parameters:**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `crop` - Filter by crop name
- `stage` - Filter by stage (Planting/Growing/Flowering/Harvest)

**Example:**
```
GET /api/crops?stage=Growing&crop=Corn
```

**Response:**
```json
[
  {
    "id": 1,
    "date": "2025-10-01",
    "crop": "Corn",
    "area": 5,
    "stage": "Growing",
    "yield": 0,
    "activities": "Fertilization",
    "cost": 500,
    "created_at": "2025-10-01 10:30:00"
  }
]
```

### Add Crop Record
```
POST /api/crops
Content-Type: application/json
```

**Body:**
```json
{
  "date": "2025-10-26",
  "crop": "Wheat",
  "area": 3,
  "stage": "Planting",
  "yield": 0,
  "activities": "Land preparation",
  "cost": 400
}
```

### Delete Crop Record
```
DELETE /api/crops/:id
```

---

## 🛒 Farm Inputs Endpoints

### Get All Inputs
```
GET /api/inputs
```

**Query Parameters:**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `category` - Filter by category
- `lowStock` - Show only low stock items (true/false)

**Example:**
```
GET /api/inputs?lowStock=true
GET /api/inputs?category=Fertilizer
```

**Response:**
```json
[
  {
    "id": 1,
    "date": "2025-10-01",
    "category": "Fertilizer",
    "name": "NPK 15-15-15",
    "quantity": 500,
    "unit": "kg",
    "supplier": "AgriSupply Co",
    "cost": 750,
    "usedFor": "Corn field",
    "currentStock": 150,
    "minStock": 200,
    "usageRate": 50,
    "notes": "Bulk purchase",
    "created_at": "2025-10-01 10:30:00"
  }
]
```

### Add Input Record
```
POST /api/inputs
Content-Type: application/json
```

**Body:**
```json
{
  "date": "2025-10-26",
  "category": "Feed",
  "name": "Layer Mash",
  "quantity": 1000,
  "unit": "kg",
  "supplier": "Poultry Feeds Ltd",
  "cost": 450,
  "usedFor": "Batch A layers",
  "currentStock": 800,
  "minStock": 300,
  "usageRate": 100,
  "notes": "Monthly stock"
}
```

### Update Stock Level
```
PUT /api/inputs/:id
Content-Type: application/json
```

**Body:**
```json
{
  "currentStock": 500
}
```

### Delete Input Record
```
DELETE /api/inputs/:id
```

---

## 📊 Reports Endpoints

### Get Summary Stats
```
GET /api/reports/summary
```

**Response:**
```json
{
  "totalPoultry": 1298,
  "totalEggs": 1385,
  "totalCropArea": 10,
  "totalInputsCost": 2090,
  "lowStockAlerts": 3
}
```

### Get Poultry Performance
```
GET /api/reports/poultry-performance
```

**Query Parameters:**
- `startDate` - Filter from date
- `endDate` - Filter to date

**Response:**
```json
[
  {
    "date": "2025-10-22",
    "type": "Layers",
    "totalEggs": 790,
    "totalFeed": 135,
    "totalMortality": 1,
    "eggPerBird": 0.93
  }
]
```

### Get Inputs by Category
```
GET /api/reports/inputs-by-category
```

**Response:**
```json
[
  {
    "category": "Fertilizer",
    "totalCost": 930,
    "count": 2
  },
  {
    "category": "Feed",
    "totalCost": 730,
    "count": 2
  }
]
```

### Get Crop Costs
```
GET /api/reports/crop-costs
```

**Response:**
```json
[
  {
    "crop": "Corn",
    "totalCost": 600,
    "totalArea": 5
  },
  {
    "crop": "Wheat",
    "totalCost": 200,
    "totalArea": 3
  }
]
```

---

## 🏥 Health Check

### Check API Status
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Farm Dashboard API is running"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (invalid data)
- `404` - Not found
- `500` - Server error

---

## Testing with cURL

### Add a poultry record:
```bash
curl -X POST http://localhost:3000/api/poultry \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-26",
    "type": "Layers",
    "count": 500,
    "eggs": 450,
    "feed": 75,
    "mortality": 0,
    "batchName": "Batch A",
    "notes": "Test record"
  }'
```

### Get all poultry records:
```bash
curl http://localhost:3000/api/poultry
```

### Get filtered records:
```bash
curl "http://localhost:3000/api/poultry?type=Layers&startDate=2025-10-01"
```

### Delete a record:
```bash
curl -X DELETE http://localhost:3000/api/poultry/5
```

---

## JavaScript Fetch Examples

### Add record:
```javascript
const response = await fetch('/api/poultry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2025-10-26',
    type: 'Layers',
    count: 500,
    eggs: 450
  })
});
const data = await response.json();
```

### Get records:
```javascript
const response = await fetch('/api/poultry?type=Layers');
const data = await response.json();
```

---

**Note:** Replace `localhost:3000` with your deployed URL when in production.
