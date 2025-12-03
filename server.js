const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.static(__dirname)); // serve index.html
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


const DATA_FILE = path.join(__dirname, 'data.json');


app.get('/backup', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const backupDir = path.join(__dirname, 'backups');

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `data${timestamp}.json`);

    const data = fs.readFileSync(dataPath, 'utf-8');
    fs.writeFileSync(backupPath, data);

    res.status(200).send({ message: 'Backup created', file: backupPath });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Backup failed' });
  }
});

app.get('/load', (req, res) => {
if (!fs.existsSync(DATA_FILE)) return res.json({ rows: [], portTotal: 0 });
const data = JSON.parse(fs.readFileSync(DATA_FILE));
res.json(data);
});


app.post('/save', (req, res) => {
fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
res.json({ status: 'OK' });
});


app.listen(3000, () => console.log('Server running on port 3000'));