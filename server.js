const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const Utils = require('./modules/utils');

// load greeting string (relative to THIS file)
const strings = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'lang', 'messages', 'en', 'en.json'), 'utf8')
);

// accept these paths (case-sensitive); we’ll also accept "/" for convenience
const ENDPOINTS = new Set([
  '/',
  '/COMP4537/labs/3/getDate/',
  '/COMP4537/labs/3/getDate'
]);

class Server {
  constructor(port) { this.port = port || 3000; }

  start() {
    http.createServer((req, res) => this.handle(req, res))
      .listen(this.port, '0.0.0.0', () => console.log(`Listening on :${this.port}`));
  }

  handle(req, res) {
    const u = new URL(req.url, 'http://x'); // dummy base
    console.log('REQ', req.method, u.pathname, u.search); // <-- shows in Render logs

    // allow both "/" and the lab endpoint
    if (!ENDPOINTS.has(u.pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }

    const name = (u.searchParams.get('name') || 'Guest').trim();
    const msg = strings.greeting.replace('%1', name) + ' ' + Utils.getDate();

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<p style="color: blue;">${msg}</p>`);
  }
}

const PORT = process.env.PORT || 3000;   // IMPORTANT for Render
new Server(PORT).start();
