const initSqlJs = require('sql.js');

let _db = null;

async function buildDb() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
  )`);

  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT, category TEXT,
    price REAL, stock INTEGER, description TEXT
  )`);

  db.run(`CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    ip TEXT NOT NULL
  )`);

  db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    ['admin', 'ShieldX9', 'admin']);

  const products = [
    [1,'ProBook X1 Laptop','Laptops',1299.00,14,'14-inch IPS, Core i7, 16GB RAM, 512GB NVMe'],
    [2,'SoundForce Pro Headphones','Audio',149.00,32,'ANC, 30-hour battery, USB-C'],
    [3,'MechaKey RGB Keyboard','Peripherals',89.00,27,'Tenkeyless, Cherry MX Brown, per-key RGB'],
    [4,'UltraView 27" Monitor','Displays',449.00,8,'4K IPS 144Hz HDR400 USB-C 65W'],
    [5,'PrecisionX Mouse','Peripherals',59.00,45,'16000 DPI, 2.4GHz wireless, 70h battery'],
    [6,'HubConnect Pro 7-Port','Accessories',39.00,61,'USB-C hub, HDMI 4K, SD, 100W PD'],
    [7,'ClearCam 4K Webcam','Accessories',79.00,19,'4K 30fps, autofocus, dual mics'],
    [8,'SpeedDrive 1TB SSD','Storage',119.00,36,'NVMe PCIe 4.0, 7000MB/s read, 5yr warranty'],
  ];
  for (const p of products) {
    db.run(`INSERT INTO products VALUES (?,?,?,?,?,?)`, p);
  }

  const logEntries = [
    ['2024-11-18 02:11:04', 'j.harris',    'GET /admin',                   '10.0.1.14'],
    ['2024-11-18 07:43:22', 'r.wong',      'POST /api/login',              '10.0.1.27'],
    ['2024-11-18 09:15:01', 'admin',       'GET /admin/logs',              '10.0.1.1'],
    ['2024-11-18 11:02:50', 'k.santos',    'GET /search?q=laptop',         '10.0.2.88'],
    ['2024-11-19 00:31:17', 'ctf_ghost',   'POST /api/submit — BakaCTF{A1d3nP1erc3?}', '10.8.0.3'],
    ['2024-11-19 03:47:09', 'm.okafor',    'GET /api/products',            '10.0.1.55'],
    ['2024-11-19 06:05:33', 'admin',       'PUT /api/products/4',          '10.0.1.1'],
    ['2024-11-19 08:22:44', 's.petrov',    'POST /api/login — failed',     '185.220.101.9'],
    ['2024-11-19 10:45:18', 's.petrov',    'POST /api/login — failed',     '185.220.101.9'],
    ['2024-11-20 01:09:37', 'l.nakamura',  'GET /admin/orders',            '10.0.1.34'],
    ['2024-11-20 04:52:11', 'admin',       'DELETE /api/logs/purge',       '10.0.1.1'],
    ['2024-11-20 08:19:55', 't.ibrahim',   'GET /search?q=monitor',        '10.0.3.12'],
  ];
  for (const [ts, username, action, ip] of logEntries) {
    db.run(`INSERT INTO logs (ts, username, action, ip) VALUES (?,?,?,?)`,
      [ts, username, action, ip]);
  }

  return db;
}

let _ready = null;

module.exports = function getDb() {
  if (!_ready) {
    _ready = buildDb();
  }
  return _ready;
};
