const https = require('https');
const http = require('http');
const url = require('url');

module.exports = async (req, res) => {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
  const targetUrl = `https://api.cloudinary.com/v1_1/${cloudName}${req.url.replace('/api/cloudinary', '')}`;

  const parsedUrl = url.parse(targetUrl);
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: req.method,
    headers: {
      ...req.headers,
      host: parsedUrl.hostname,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.statusCode = 500;
    res.end('Proxy error');
  });

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
};