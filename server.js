const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');
const Utils = require('./modules/utils');

// load Part B greeting
const strings = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'lang', 'messages', 'en', 'en.json'), 'utf8')
);

// base path used by the lab
const BASE = '/COMP4537/labs/3';
const GET_DATE = `${BASE}/getDate/`;      // Part B
const WRITE_FILE = `${BASE}/writeFile/`;  // Part C.1 (?text=...)
const READ_FILE_BASE = `${BASE}/readFile/`; // Part C.2 (/readFile/<filename>)

// where file.txt will live (same folder as server.js)
const DATA_DIR = __dirname;

class Server {
  constructor(port) { this.port = port || 3000; }

  start() {
    http.createServer((req, res) => this.handle(req, res))
      .listen(this.port, '0.0.0.0', () => console.log(`Listening on :${this.port}`));
  }

  async handle(req, res) {
    const u = new URL(req.url, 'http://x'); // dummy base for parsing
    const { pathname, searchParams } = u;

    try {
      // ---- Part B: /getDate/?name=... ----
      if (req.method === 'GET' && (pathname === GET_DATE || pathname === GET_DATE.slice(0, -1))) {
        const name = (searchParams.get('name') || 'Guest').trim();
        const msg = strings.greeting.replace('%1', name) + ' ' + Utils.getDate();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(`<p style="color: blue;">${msg}</p>`);
      }

      // ---- Part C.1: /writeFile/?text=BCIT ----
      if (req.method === 'GET' && (pathname === WRITE_FILE || pathname === WRITE_FILE.slice(0, -1))) {
        const text = (searchParams.get('text') ?? '').toString();
        const filePath = path.join(DATA_DIR, 'file.txt');
        await Utils.appendLine(filePath, text);
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(`Appended to file.txt: ${text}`);
      }

      // ---- Part C.2: /readFile/<filename> ----
      if (req.method === 'GET' && pathname.startsWith(READ_FILE_BASE)) {
        const filename = pathname.slice(READ_FILE_BASE.length); // everything after /readFile/
        // basic safety: no traversal / absolute paths
        if (!filename || filename.includes('..') || path.isAbsolute(filename)) {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Invalid filename.');
        }
        const filePath = path.join(DATA_DIR, filename);
        try {
          const content = await Utils.readText(filePath);
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end(content); // display in browser, not download
        } catch (e) {
          if (e.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end(`404: File not found: ${filename}`);
          }
          throw e;
        }
      }

      // fallback
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    } catch (err) {
      console.error('ERROR', err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Internal error: ${err.message}`);
    }
  }
}

const PORT = process.env.PORT || 3000;
new Server(PORT).start();
