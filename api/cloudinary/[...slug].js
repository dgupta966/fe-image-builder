const querystring = require('querystring');

module.exports = async (req, res) => {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
  const path = req.query.slug ? req.query.slug.join('/') : '';

  // Remove slug from query to get other params
  const query = { ...req.query };
  delete query.slug;

  const queryStr = Object.keys(query).length ? '?' + querystring.stringify(query) : '';
  const targetUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${path}${queryStr}`;

  try {
    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await new Promise((resolve, reject) => {
        let chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined, // Remove host header
      },
      body: body,
    });

    // Copy response headers
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }

    res.statusCode = response.status;
    const responseBody = await response.text();
    res.end(responseBody);
  } catch (error) {
    console.error('Proxy error:', error);
    res.statusCode = 500;
    res.end('Proxy error');
  }
};