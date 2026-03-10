# Wandr — Travel Experience Listing Platform

A full-stack web platform where experience providers can publish travel listings and travelers can discover them.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MySQL + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Deployment | Vercel (frontend) + Railway (backend) |

## Features Implemented

**Core:**
- User registration & login (JWT auth)
- Create travel experience listings (title, location, image URL, description, price)
- Public feed with newest-first ordering
- Listing detail page

**Optional:**
- Edit & delete listings (owner only)
- Search listings by title, location, or description
- Like / unlike listings
- Pagination (12 per page)
- Responsive mobile UI

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL running locally
- Git

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/travel-platform.git
cd travel-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## Architecture & Key Decisions

### Why this stack?
React + Vite gives fast HMR and a clean component model. Express is lightweight and gives full control over the API. MySQL is a reliable relational database well-suited for structured travel listing data with user relationships. Prisma was chosen as the ORM for its type safety, readable schema, and easy migrations.

### How authentication works
Users register with email + password. Passwords are hashed with bcryptjs (salt rounds: 10). On login, a JWT token is issued with a 7-day expiry containing the user's id, name, and email. The token is stored in localStorage on the client and sent as a `Bearer` token in the `Authorization` header on every protected API request. The backend verifies the token using a middleware before allowing access to protected routes.

### How listings are stored
Listings are stored in a MySQL `Listing` table with a foreign key to the `User` table. A separate `Like` table with a unique constraint on `(userId, listingId)` handles the many-to-many like relationship. Prisma handles migrations and type-safe queries.

### One improvement with more time
I would add image file uploads (using Cloudinary or AWS S3) instead of requiring users to paste image URLs — this significantly improves UX and reduces broken image links.

## Product Thinking: 10,000 Listings at Scale

With 10,000+ listings, several changes would improve performance and user experience. First, pagination is already implemented, but infinite scroll would feel more natural on mobile. Database indexes on `createdAt`, `location`, and `title` columns would speed up the most common queries. For search, I'd replace the current SQL `LIKE` query with a dedicated full-text search engine like Elasticsearch or Meilisearch, which handles typos and ranking far better. A Redis cache layer could store the first page of the feed and popular listing details, dramatically reducing database load for repeated queries. On the API side, I'd add response compression and rate limiting. For the frontend, lazy-loading images and virtualizing long lists would keep the UI smooth regardless of how many listings are loaded.

