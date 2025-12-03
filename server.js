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