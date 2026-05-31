import http from 'http';
import { runDivergenceWorkflow } from '@smd/workflows';
import url from 'url';
import fs from 'fs';
import path from 'path';

/** Serve static files from the apps/web directory. */
function serveStatic(req: http.IncomingMessage, res: http.ServerResponse, pathname: string) {
  const publicDir = path.resolve(__dirname, '../../../apps/web');
  let filePath = path.join(publicDir, pathname);
  // If directory, default to index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mime: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
  };
  res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
}

function startServer(port: number) {
  const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url || '', true);
    const pathname = parsed.pathname || '/';
    // API routes
    if (pathname === '/api/health' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      return;
    }
    if (pathname === '/api/board' && req.method === 'GET') {
      try {
        const result = await runDivergenceWorkflow();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.details));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to compute divergence board', message: err.message }));
      }
      return;
    }
    if (pathname.startsWith('/api/case/') && req.method === 'GET') {
      const id = decodeURIComponent(pathname.replace('/api/case/', ''));
      try {
        const result = await runDivergenceWorkflow();
        const found = result.details.find((c) => c.id === id);
        if (!found) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Case not found' }));
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(found));
        }
      } catch (err: any) {
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