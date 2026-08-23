import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Backend Course & Real-Time PDF/Class Data Proxies
 * Securely proxies live data from multi-streaming backend to prevent CORS & hide backend URLs
 */
app.get('/api/proxy/courses', async (_req, res) => {
  try {
    const upstream = await fetch('https://backend.multistreaming.site/api/courses/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json'
      }
    });
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: 'Upstream returned ' + upstream.status });
      return;
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch courses' });
  }
});

app.get('/api/proxy/courses/:id', async (req, res) => {
  try {
    const upstream = await fetch(`https://backend.multistreaming.site/api/courses/${req.params.id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json'
      }
    });
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: 'Upstream returned ' + upstream.status });
      return;
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch course detail' });
  }
});

app.get('/api/proxy/courses/:id/classes', async (req, res) => {
  try {
    const upstream = await fetch(`https://backend.multistreaming.site/api/courses/${req.params.id}/classes?populate=full`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json'
      }
    });
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: 'Upstream returned ' + upstream.status });
      return;
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch classes' });
  }
});

app.get('/api/proxy/courses/:id/pdfs', async (req, res) => {
  try {
    const upstream = await fetch(`https://gdgoenkaratia.com/api/courses/${req.params.id}/pdfs?groupBy=topic`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json'
      }
    });
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: 'Upstream returned ' + upstream.status });
      return;
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch pdfs' });
  }
});

/**
 * Universal Stream & HLS Playlist Proxy
 * Bypasses CORS restrictions on remote .m3u8 playlists and .ts segments
 */
app.get('/api/stream-proxy', async (req, res) => {
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    res.status(400).send('Missing "url" query parameter');
    return;
  }

  try {
    const upstreamHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: new URL(targetUrl).origin + '/'
    };

    // Forward range header if present (critical for seeking & audio/video streams)
    if (req.headers.range) {
      upstreamHeaders['Range'] = req.headers.range;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: upstreamHeaders
    });

    if (!response.ok && response.status !== 206) {
      res.status(response.status).send(`Upstream server returned error ${response.status}`);
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    const isM3u8 =
      targetUrl.includes('.m3u8') ||
      contentType.includes('mpegurl') ||
      contentType.includes('application/x-mpegurl');

    // CORS & playback headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

    if (isM3u8) {
      const manifestText = await response.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      // Rewrite URLs inside the M3U8 manifest so child manifests and segments go through the proxy
      const rewrittenLines = manifestText.split('\n').map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // Rewrite encryption keys if any
        if (trimmed.startsWith('#EXT-X-KEY:')) {
          return trimmed.replace(/URI="([^"]+)"/, (_match, uri) => {
            const absoluteKeyUrl = new URL(uri, baseUrl).toString();
            return `URI="/api/stream-proxy?url=${encodeURIComponent(absoluteKeyUrl)}"`;
          });
        }

        // If line is a comment or directive, leave as is
        if (trimmed.startsWith('#')) {
          return line;
        }

        // It's a segment or child playlist URL
        try {
          const absoluteUrl = new URL(trimmed, baseUrl).toString();
          return `/api/stream-proxy?url=${encodeURIComponent(absoluteUrl)}`;
        } catch {
          return line;
        }
      });

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(200).send(rewrittenLines.join('\n'));
    } else {
      // It's a binary segment (.ts), video file, or audio track
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else if (targetUrl.endsWith('.ts')) {
        res.setHeader('Content-Type', 'video/MP2T');
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      const contentRange = response.headers.get('content-range');
      if (contentRange) {
        res.setHeader('Content-Range', contentRange);
        res.status(206);
      } else {
        res.status(response.status);
      }

      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      // Stream the binary response body
      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                res.end();
                break;
              }
              res.write(Buffer.from(value));
            }
          } catch (streamErr) {
            res.end();
          }
        };
        pump();
      } else {
        const arrayBuf = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuf));
      }
    }
  } catch (error: any) {
    console.error('Error proxying stream:', error);
    if (!res.headersSent) {
      res.status(500).send(`Failed to proxy stream: ${error.message || error}`);
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NST RUDRA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
