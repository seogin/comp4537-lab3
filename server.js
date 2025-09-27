// server.js
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const Utils = require('./modules/utils');

// load greeting string
const strings = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'lang/messages/en/en.json'), 'utf8')
);

// if you want to enforce the lab endpoint, set it here:
const ENDPOINT = '/COMP4537/labs/3/getDate/';  // <- use this OR remove the route check

class Server {
  constructor(port) {
    this.port = port || 3000;
  }

  start() {
    http
      .createServer((req, res) => this.handleRequest(req, res))
      .listen(this.port, '0.0.0.0', () => {
        console.log(`Listening on :${this.port}`);
      });
  }

  handleRequest(req, res) {
    // If you want any path to work, comment out the next 4 lines.
    const { pathname } = new URL(req.url, 'http://x');
    if (pathname !== ENDPOINT) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }

    const q = url.parse(req.url, true);
    const name = (q.query && q.query.name) ? q.query.name : 'Guest';

    const message = strings.greeting.replace('%1', name) + ' ' + Utils.getDate();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<p style="color: blue;">${message}</p>`);
  }
}

const PORT = process.env.PORT || 3000;   // <-- IMPORTANT for Render
new Server(PORT).start();
