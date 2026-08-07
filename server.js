const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function requestWeather(city, res) {
  if (!WEATHER_API_KEY) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Weather API key is not configured' }));
    return;
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`;

  https.get(url, (apiRes) => {
    let body = '';
    apiRes.on('data', (chunk) => {
      body += chunk;
    });
    apiRes.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(body);
    });
  }).on('error', () => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Weather request failed' }));
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/weather')) {
    const url = new URL(req.url, 'http://localhost');
    const city = url.searchParams.get('city') || 'Siwan';
    requestWeather(city, res);
    return;
  }

  let reqPath = req.url === '/' ? '/index.html' : req.url;
  reqPath = reqPath.split('?')[0];
  const filePath = path.join(ROOT, decodeURIComponent(reqPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
