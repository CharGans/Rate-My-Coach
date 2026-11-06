# Rate-My-Coach
A coach rating app for looking for personal trainers, fitness coaches, and body building coaches.

the stack i would like to use is as follows:

Option 1: The Modern Jamstack / Serverless Stack ($0/month)
This architecture is free, automatically handles SSL certificates, scales effortlessly, and doesn't crash if a review suddenly gets shared heavily on social media.
Frontend (Free): Host the website user interface on Vercel, Netlify, or Cloudflare Pages.
Cost: $0 / month (Unlimited builds, free custom domain connection, free SSL).
Best tool for job: Next.js, React, or Svelte on Vercel or Cloudflare.
Database (Free): Store user accounts, coach profiles, ratings, and text reviews using Supabase (PostgreSQL) or PlanetScale.
Cost: $0 / month (Supabase gives 500 MB database storage for free, which holds roughly 100,000+ text reviews).
User Auth (Free): Use Supabase Auth or Clerk.
Cost: $0 / month (Up to 10,000+ monthly active users free).
File Storage for Review Images (Free): If users upload photo proof or profile pictures, store them in Cloudflare R2 or Supabase Storage.
Cost: $0 / month (Cloudflare R2 offers 10 GB of free storage and zero egress/bandwidth fees).