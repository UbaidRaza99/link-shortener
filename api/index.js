const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage for Vercel (since file system is read-only)
let urls = {};

// Generate random short code
function generateShortCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Get BASE_URL from environment or request
function getBaseUrl(req) {
    return process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : `${req.protocol}://${req.get('host')}`;
}

// API: Create short URL
app.post('/api/shorten', (req, res) => {
    const { longUrl } = req.body;
    
    if (!longUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
        new URL(longUrl);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    const baseUrl = getBaseUrl(req);
    
    // Check if URL already exists
    for (const [code, data] of Object.entries(urls)) {
        if (data.longUrl === longUrl) {
            return res.json({
                shortCode: code,
                shortUrl: `${baseUrl}/${code}`,
                longUrl: longUrl
            });
        }
    }

    // Generate unique short code
    let shortCode;
    do {
        shortCode = generateShortCode();
    } while (urls[shortCode]);

    // Save URL
    urls[shortCode] = {
        longUrl: longUrl,
        createdAt: new Date().toISOString(),
        clicks: 0
    };

    res.json({
        shortCode: shortCode,
        shortUrl: `${baseUrl}/${shortCode}`,
        longUrl: longUrl
    });
});

// API: Get all URLs
app.get('/api/urls', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const urlList = Object.entries(urls).map(([code, data]) => ({
        shortCode: code,
        shortUrl: `${baseUrl}/${code}`,
        longUrl: data.longUrl,
        createdAt: data.createdAt,
        clicks: data.clicks
    }));
    res.json(urlList);
});

// API: Delete URL
app.delete('/api/urls/:code', (req, res) => {
    const { code } = req.params;
    
    if (urls[code]) {
        delete urls[code];
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

// Redirect short URL to long URL
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    
    // Ignore static files
    if (shortCode.includes('.')) {
        return res.status(404).send('Not found');
    }
    
    if (urls[shortCode]) {
        urls[shortCode].clicks++;
        res.redirect(urls[shortCode].longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', urls: Object.keys(urls).length });
});

module.exports = app;
