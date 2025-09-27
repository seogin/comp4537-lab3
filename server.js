const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const Utils = require('./modules/utils');

// load greeting string
const strings = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'lang', 'messages', 'en', 'en.json'), 'utf8')
);

// accepted endpoints
const ENDPOINTS = new Set([
  '/',                                  // root
  '/COMP4537/labs/3/getDate/',          // exact lab path
  '/COMP4537/labs/3/getDate'            // no trailing slash
]);

class Server {
  constructor(port) { this.port = port || 3000; }

  start() {
    http.createServer((req, res) => this.handle(req, res))
      .listen(this.port, '0.0.0.0', () => console.log(`Listening on :${this.port}`));
  }

  handle(req, res) {
    const u = new URL(req.url, 'http://x'); // base dummy
    const pathname = u.pathname;

    if (!ENDPOINTS.has(pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }

    const name = (u.searchParams.get('name') || 'Guest').trim();
    const msg = strings.greeting.replace('%1', name) + ' ' + Utils.getDate();

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<p style="color: blue;">${msg}</p>`);
  }
}

const PORT = process.env.PORT || 3000;  // important for Render
new Server(PORT).start();
