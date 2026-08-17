const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Production-ready BASE_URL configuration
// Environment variable se domain set hoga (Vercel pe automatic)
const BASE_URL = process.env.BASE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                 `http://localhost:${PORT}`);

// URLs storage file
const urlsFile = path.join(__dirname, 'urls.json');

// Initialize URLs file if it doesn't exist
if (!fs.existsSync(urlsFile)) {
    fs.writeFileSync(urlsFile, JSON.stringify({}));
}

// Generate random short code
function generateShortCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Read URLs from file
function readUrls() {
    const data = fs.readFileSync(urlsFile, 'utf8');
    return JSON.parse(data);
}

// Write URLs to file
function writeUrls(urls) {
    fs.writeFileSync(urlsFile, JSON.stringify(urls, null, 2));
}

// Middleware
app.use(express.json());

// API Routes (pehle API routes define karein)
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

    const urls = readUrls();
    
    // Check if URL already exists
    for (const [code, data] of Object.entries(urls)) {
        if (data.longUrl === longUrl) {
            return res.json({
                shortCode: code,
                shortUrl: `${BASE_URL}/${code}`,
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
    writeUrls(urls);

    res.json({
        shortCode: shortCode,
        shortUrl: `${BASE_URL}/${shortCode}`,
        longUrl: longUrl
    });
});

// API: Get all URLs
app.get('/api/urls', (req, res) => {
    const urls = readUrls();
    const baseUrl = BASE_URL;
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
    const urls = readUrls();
    
    if (urls[code]) {
        delete urls[code];
        writeUrls(urls);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

// Static files ke baad redirect route (important: API routes ke baad!)
app.use(express.static('public'));

// Redirect short URL to long URL (last mein hona chahiye)
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    
    // Ignore files with extensions (CSS, JS, etc)
    if (shortCode.includes('.')) {
        return res.status(404).send('Not found');
    }
    
    const urls = readUrls();
    
    if (urls[shortCode]) {
        // Increment click count
        urls[shortCode].clicks++;
        writeUrls(urls);
        
        res.redirect(urls[shortCode].longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Link Shortener running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
