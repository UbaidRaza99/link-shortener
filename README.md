# 🔗 Link Shortener - Professional URL Shortener

A modern, production-ready URL shortener built with Node.js, Express, and a beautiful glassmorphic UI.

![Link Shortener](https://img.shields.io/badge/Status-Production%20Ready-success)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)

## ✨ Features

- 🎨 **Modern Glassmorphic UI** - Beautiful dark theme with blur effects
- ⚡ **Fast & Lightweight** - Instant URL shortening
- 📊 **Click Tracking** - Monitor URL usage statistics
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🔄 **Real-time Updates** - Live URL list management
- 📋 **One-Click Copy** - Easy clipboard integration
- 🗑️ **URL Management** - Delete unwanted URLs
- 🚀 **Production Ready** - Deploy anywhere (Vercel, Heroku, Railway, etc.)

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
```bash
git clone <repository-url>
cd link-shortener
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

4. **Open browser:**
```
http://localhost:3000
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Or manually:**

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### Deploy to Heroku

```bash
heroku create your-app-name
git push heroku main
heroku open
```

### Deploy to Railway

1. Visit [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy automatically

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** JSON file (upgradeable to MongoDB/PostgreSQL)
- **Deployment:** Vercel-ready with serverless functions

## 📁 Project Structure

```
link-shortener/
├── api/
│   └── index.js          # Vercel serverless entry
├── public/
│   ├── index.html        # Main page
│   ├── style.css         # Glassmorphic styles
│   └── script.js         # Frontend logic
├── server.js             # Express server
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── urls.json            # URL storage (local dev)
```

## 🔧 Configuration

### Environment Variables

Create `.env` file (optional):

```env
# Production URL (auto-detected on Vercel)
BASE_URL=https://your-domain.com

# Port (default: 3000)
PORT=3000
```

### Custom Domain

After deployment, add custom domain:
1. Go to project settings on your hosting platform
2. Add custom domain
3. Update DNS records

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create short URL |
| GET | `/api/urls` | Get all URLs |
| DELETE | `/api/urls/:code` | Delete URL |
| GET | `/:shortCode` | Redirect to original URL |

## 🎨 Features in Detail

### URL Shortening
- Generates random 6-character codes
- Validates URLs before shortening
- Detects duplicate URLs
- Returns shareable short links

### Click Tracking
- Counts redirects automatically
- Displays click statistics
- Timestamp for creation date

### URL Management
- View all shortened URLs
- Delete unwanted URLs
- Copy short URLs instantly
- Real-time list updates

## 🔒 Security Features

- URL validation before processing
- XSS protection
- Safe redirect handling
- Input sanitization

## 📱 Responsive Design

Works perfectly on:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🚀 Performance

- ⚡ Lightweight (~50KB total)
- 🎯 No external dependencies (frontend)
- 🔄 Optimized for serverless
- 📦 Efficient JSON storage

## 🔄 Future Enhancements

- [ ] User authentication
- [ ] Custom short URLs
- [ ] QR code generation
- [ ] Analytics dashboard
- [ ] MongoDB/PostgreSQL integration
- [ ] API rate limiting
- [ ] URL expiration dates
- [ ] Bulk URL shortening

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

ISC License - feel free to use this project for personal or commercial purposes.

## 🐛 Issues

Found a bug? [Open an issue](../../issues)

## 👨‍💻 Developer

Made with ❤️ for the community

---

**⭐ Star this repo if you find it useful!**
