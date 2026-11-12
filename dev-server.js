// Tiny local server for development: `npm run dev`, then open http://localhost:3000
// Serves the static site and runs api/tmdb.js the same way Vercel does.
// No dependencies needed (Node 18+).

const http = require("http");
const fs = require("fs");
const path = require("path");
const tmdbHandler = require("./api/tmdb.js");

// Load TMDB_API_KEY from .env if present
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
}

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const TYPES = {
    ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
    ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
    ".gif": "image/gif", ".otf": "font/otf", ".svg": "image/svg+xml"
};

http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/tmdb") {
        req.query = Object.fromEntries(url.searchParams);
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (body) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
        };
        return tmdbHandler(req, res);
    }

    let filePath = url.pathname === "/" ? "/UniFlix.html" : decodeURIComponent(url.pathname);
    filePath = path.join(ROOT, path.normalize(filePath));
    if (!filePath.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }

    fs.readFile(filePath, (err, data) => {
        if (err) { res.statusCode = 404; return res.end("Not found"); }
        res.setHeader("Content-Type", TYPES[path.extname(filePath)] || "application/octet-stream");
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`UniFlix running at http://localhost:${PORT}`);
    if (!process.env.TMDB_API_KEY) console.log("Warning: TMDB_API_KEY is not set. Copy .env.example to .env and add your key.");
});
