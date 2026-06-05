# VisioAI — Deploy Instructions

## Step 1: Run Supabase SQL
1. Go to supabase.com → your project → SQL Editor
2. Paste the contents of `supabase-setup.sql` and click Run

## Step 2: Push to GitHub
1. Create a new repo at github.com called "visioai"
2. Run these commands in your terminal:

```
cd visioai
git init
git add .
git commit -m "VisioAI launch"
git remote add origin https://github.com/YOUR_USERNAME/visioai.git
git push -u origin main
```

## Step 3: Deploy on Vercel
1. Go to vercel.com → New Project → Import your "visioai" GitHub repo
2. Click Deploy

## Step 4: Add Environment Variables on Vercel
Go to your Vercel project → Settings → Environment Variables and add:

```
REPLICATE_API_TOKEN=r8_EmeacdU3FYO1lrFLLnGAkOwI51j43pe1KTban
NEXT_PUBLIC_SUPABASE_URL=https://nzoiproskgmpamqmmkic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Redeploy
After adding variables, go to Deployments → Redeploy

Your site is now LIVE! 🚀
