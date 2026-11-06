# Rate My Coach

A mobile-friendly web app for finding and reviewing personal trainers and fitness coaches across bodybuilding, fitness, and other divisions.

---

## Stack

- **Frontend** — Next.js 14 (App Router) + TypeScript
- **Styling** — Tailwind CSS
- **Database** — Supabase (PostgreSQL)
- **Auth** — Supabase Auth
- **Hosting** — Vercel (recommended)

---

## Features

- Browse coaches filtered by division (Bodybuilding, Fitness, Other)
- Coach profile pages with bio, average star rating, and review count
- Leave a star rating + written review on any coach
- One review per user per coach enforced at the database level
- Average rating auto-updates via a Postgres trigger on every review change
- Sign up / login with email and password
- Mobile-friendly UI with proper touch targets and viewport scaling

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page — coach listing with division filter
│   ├── layout.tsx            # Root layout with Navbar
│   ├── auth/
│   │   └── page.tsx          # Sign in / Sign up page
│   └── coaches/
│       └── [id]/
│           └── page.tsx      # Coach detail page with reviews
├── components/
│   ├── Navbar.tsx            # Top nav with auth state
│   └── ReviewForm.tsx        # Star picker + review text form
└── lib/
    ├── supabase.ts           # Supabase browser client
    └── types.ts              # Shared TypeScript types

supabase/
└── schema.sql                # Database schema — run this in Supabase SQL editor
```

---

## Database Schema

### Tables
- `profiles` — public user profiles linked to Supabase auth users (id, username, avatar_url)
- `coaches` — coach profiles (name, division, bio, avatar_url, avg_rating, review_count)
- `reviews` — user reviews (coach_id, user_id, rating 1–5, body text)

### Logic
- A Postgres trigger (`on_review_change`) automatically recalculates `avg_rating` and `review_count` on the `coaches` table whenever a review is inserted, updated, or deleted
- Row Level Security (RLS) is enabled on all tables — anyone can read, only authenticated users can write their own data

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `supabase/schema.sql`
3. Go to **Settings** → **Data API** and copy your **Project URL** and **anon** key

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure Supabase Auth
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to `http://localhost:3000`
3. Add `http://localhost:3000/**` to **Redirect URLs**

### 5. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Adding Coaches (Development)

Until an admin UI is built, coaches can be added directly via the Supabase Table Editor:

1. Go to **Table Editor** → `coaches`
2. Click **Insert row**
3. Fill in `name`, `division` (`bodybuilding`, `fitness`, or `other`), and optionally `bio`

---

## Deployment

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables
4. Update your Supabase **Site URL** and **Redirect URLs** to your Vercel domain
