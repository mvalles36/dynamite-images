const fs = require('fs');
const path = require('path');

const max_age = 0; // 600; // seconds this URL should be cached
const response = [];

const fontsDirectory = path.join(__dirname, '../fonts');
const includedFonts = fs.readdirSync(fontsDirectory)
  .filter(file => file.endsWith('.ttf'))
  .map(file => path.basename(file, '.ttf'));

const expires = new Date(Date.now() + max_age * 1000).toUTCString();
const cacheControl = `public, max-age=${max_age}`;

const headers = {
  'Expires': expires,
  'Cache-Control': cacheControl,
  'Content-Type': 'application/json'
};

includedFonts.forEach(font => {
  response.push(font);
});

const jsonResponse = JSON.stringify(response);

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, headers);
  res.end(jsonResponse);
});

const port = 8080; // Change this to the desired port number
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
