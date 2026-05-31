"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const workflows_1 = require("@smd/workflows");
const url_1 = __importDefault(require("url"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** Serve static files from the apps/web directory. */
function serveStatic(req, res, pathname) {
    const publicDir = path_1.default.resolve(__dirname, '../../../apps/web');
    let filePath = path_1.default.join(publicDir, pathname);
    // If directory, default to index.html
    if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isDirectory()) {
        filePath = path_1.default.join(filePath, 'index.html');
    }
    if (!fs_1.default.existsSync(filePath)) {
        res.statusCode = 404;
        res.end('Not found');
        return;
    }
    const ext = path_1.default.extname(filePath).toLowerCase();
    const mime = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json'
    };
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    fs_1.default.createReadStream(filePath).pipe(res);
}
function startServer(port) {
    const server = http_1.default.createServer(async (req, res) => {
        const parsed = url_1.default.parse(req.url || '', true);
        const pathname = parsed.pathname || '/';
        // API routes
        if (pathname === '/api/health' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
            return;
        }
        if (pathname === '/api/board' && req.method === 'GET') {
            try {
                const result = await (0, workflows_1.runDivergenceWorkflow)();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result.details));
            }
            catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to compute divergence board', message: err.message }));
            }
            return;
        }
        if (pathname.startsWith('/api/case/') && req.method === 'GET') {
            const id = decodeURIComponent(pathname.replace('/api/case/', ''));
            try {
                const result = await (0, workflows_1.runDivergenceWorkflow)();
                const found = result.details.find((c) => c.id === id);
                if (!found) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Case not found' }));
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(found));
                }
            }
            catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to compute case', message: err.message }));
            }
            return;
        }
        // Otherwise serve static web files
        if (pathname === '/' || !pathname.startsWith('/api')) {
            serveStatic(req, res, pathname === '/' ? 'index.html' : pathname);
            return;
        }
        // default 404
        res.statusCode = 404;
        res.end('Not found');
    });
    server.listen(port, () => {
        console.log(`SmartMoneyDelta server listening on port ${port}`);
    });
}
const port = parseInt(process.env.PORT || '3000', 10);
startServer(port);
//# sourceMappingURL=index.js.map