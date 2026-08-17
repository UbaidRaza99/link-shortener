# Vercel Deployment Guide 🚀

## Step-by-Step Vercel Deploy Karne Ka Tareeqa

### Option 1: Vercel CLI (Terminal se - Recommended) ⚡

1. **Vercel CLI Install karein:**
```bash
npm install -g vercel
```

2. **Link Shortener folder mein jaayen:**
```bash
cd link-shortener
```

3. **Vercel login karein:**
```bash
vercel login
```
   - Email enter karein
   - Email mein verification link aayega, click karein

4. **Deploy karein:**
```bash
vercel
```
   - Saare questions mein ENTER press karein (default settings accept karein)
   - Project name confirm karein
   - Deploy ho jayega!

5. **Production deploy karne ke liye:**
```bash
vercel --prod
```

### Option 2: Vercel Website se (Manual Upload) 🌐

1. **Vercel account banayein:**
   - https://vercel.com pe jaayein
   - "Sign Up" click karein
   - GitHub/GitLab/Email se signup karein

2. **New Project:**
   - Dashboard pe "Add New" → "Project" click karein
   - "Browse" karke `link-shortener` folder select karein
   - Ya phir GitHub repository se import karein

3. **Deploy Settings:**
   - Framework Preset: **Other**
   - Build Command: (khaali chhod dein)
   - Output Directory: **public**
   - Install Command: **npm install**

4. **Deploy button click karein:**
   - Vercel automatically deploy kar dega
   - URL mil jayega (e.g., your-project.vercel.app)

### Option 3: GitHub se Deploy (Best for Updates) 🔄

1. **GitHub repository banayein:**
```bash
cd link-shortener
git init
git add .
git commit -m "Initial commit"
```

2. **GitHub pe push karein:**
   - GitHub pe new repository banayein
   - Commands follow karein jo GitHub batayega

3. **Vercel se connect karein:**
   - Vercel dashboard pe "Import Project"
   - "Import Git Repository" select karein
   - Apna GitHub repo select karein
   - Deploy click karein

4. **Auto-deploy:**
   - Ab jab bhi GitHub pe push karenge, automatic deploy hoga!

## Important Notes 📝

### Database Issue:
**IMPORTANT:** Vercel pe `urls.json` file reset ho jayegi har deploy pe!

**Solution Options:**

1. **MongoDB Atlas (Recommended):**
   - Free MongoDB cloud database
   - Permanent storage
   - Setup guide: https://www.mongodb.com/cloud/atlas

2. **Vercel KV (Redis):**
   - Vercel ka own key-value store
   - Paid service

3. **Supabase (PostgreSQL):**
   - Free tier available
   - Easy to integrate

### Environment Variables:
Agar database use kar rahe ho, Vercel dashboard mein:
- Settings → Environment Variables
- Connection strings add karein

## Custom Domain 🌍

Vercel pe custom domain add karne ke liye:
1. Project Settings → Domains
2. Apna domain enter karein
3. DNS settings follow karein

## Troubleshooting 🔧

**Error: Module not found**
```bash
vercel --prod --force
```

**URLs.json not persisting:**
- Database integrate karein (MongoDB recommended)

**Build fails:**
```bash
npm install
vercel --prod
```

## After Deploy Checklist ✅

- [ ] Website khul rahi hai?
- [ ] URL shorten ho rahi hai?
- [ ] Short URL redirect kar raha hai?
- [ ] URLs list dikh rahi hai?
- [ ] Copy button kaam kar raha hai?

## Support

Agar koi issue ho toh:
1. Vercel dashboard → Deployments → Logs check karein
2. Ya mujhe batayein! 😊

Happy Deploying! 🎉
