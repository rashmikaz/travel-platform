# Wandr — Local Travel Experience Platform

Wandr is a full-stack travel experience listing platform where local guides can post unique experiences and travelers can discover, explore, and like them. Think of it as a mini Airbnb Experiences — built from scratch with a modern, responsive UI.

---

## Project Overview

Wandr allows users to:
- Browse a feed of travel experiences posted by locals around the world
- Search experiences by destination or title
- Register and log in securely
- Post, edit, and delete their own travel experiences
- Like experiences from other users
- View a personal dashboard of their own listings

The platform is fully responsive and works across desktop, tablet, and mobile devices.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | Component-based UI |
| Vite | Fast dev server and build tool |
| React Router v6 | Client-side routing and protected routes |
| Axios | HTTP requests to the backend API |
| date-fns | Human-readable date formatting |
| react-hot-toast | Toast notifications |
| Google Fonts (Raleway) | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM | Database queries and schema management |
| MySQL | Relational database |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL running locally
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/wandr.git
cd wandr
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/travel_platform"
JWT_SECRET="your_secret_key_here"
PORT=5001
CLIENT_URL="http://localhost:5173"
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Start the backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

> The Vite dev server proxies all `/api` requests to `http://localhost:5001` automatically.

---

## Features Implemented

### Core Features
- **User Registration & Login** — Secure auth with hashed passwords and JWT tokens
- **Browse Listings** — Paginated feed of all travel experiences with search
- **Create Listing** — Post a new experience with title, location, image, description and optional price
- **Edit Listing** — Update your own listing details
- **Delete Listing** — Remove your own listing with confirmation
- **Listing Detail Page** — Full view of an experience with host info and price
- **My Listings Dashboard** — Manage all your own posted experiences

### Optional / Bonus Features
- **Like / Unlike** — Toggle likes on any experience (authenticated users only)
- **Live Preview** — Real-time card preview while creating a listing
- **Search** — Filter experiences by keyword across title and location
- **Pagination** — Feed paginated at 12 listings per page
- **Password Strength Indicator** — Visual feedback on register page
- **Responsive Design** — Fully responsive across mobile, tablet and desktop
- **Animated Hero Slideshow** — Auto-cycling travel photo carousel on home page
- **Glassmorphism Float Cards** — Animated floating UI cards on auth and home pages
- **Protected Routes** — Unauthenticated users redirected to login for private pages
- **Toast Notifications** — Feedback for all create, update, delete and auth actions

---

## Architecture & Key Decisions

### Why this tech stack?

**React + Vite** was chosen for the frontend because Vite's instant hot module replacement makes the development loop extremely fast. React's component model made it straightforward to build reusable pieces like `ListingCard`, `Navbar`, and `Footer` that are shared across pages.

**Express + Prisma + MySQL** was chosen for the backend because this combination gives full control over the API while Prisma removes the friction of writing raw SQL. Prisma's schema-first approach also makes the database structure easy to read, version-control, and migrate. MySQL was chosen because relational data (users owning listings, listings having likes) maps cleanly to a relational model.

### How authentication works

Authentication uses a **stateless JWT flow**:

1. On **register or login**, the server verifies credentials, then signs a JWT with the user's `id` and returns it to the client alongside the user object.
2. The frontend stores the token in `localStorage` and attaches it to every subsequent request as a `Bearer` token in the `Authorization` header.
3. Protected API routes (create, edit, delete, like) run the token through an `auth` middleware that verifies the signature and attaches the decoded user to `req.user`.
4. On the frontend, a `PrivateRoute` wrapper checks for a valid user in context before rendering protected pages — unauthenticated users are redirected to `/login`.

This approach is stateless, meaning the server does not need to store sessions, which keeps the backend simple and scalable.

### How travel listings are stored

Listings live in a relational MySQL database with three core tables:

- **User** — stores name, email, and hashed password
- **Listing** — stores title, location, imageUrl, description, price (optional), and a `userId` foreign key linking each listing to its owner
- **Like** — a join table with `userId` and `listingId` columns and a unique compound constraint `@@unique([userId, listingId])` to prevent duplicate likes

When fetching listings, Prisma eager-loads the related `user` (for author display) and `likes` (for like count) using `include`. This avoids N+1 query problems and keeps the API responses self-contained.

### One improvement I would implement with more time

**Image uploads with cloud storage.** Currently, listings require an external image URL. I would integrate **Cloudinary** (or AWS S3) so users can upload images directly from their device. This would involve adding a file upload endpoint on the backend using `multer`, streaming the file to Cloudinary, and returning a hosted URL to store in the database. This would significantly improve the user experience — requiring users to find and paste an image URL is a friction point that would drop real-world adoption.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/listings` | No | Get all listings (search, pagination) |
| GET | `/api/listings/:id` | No | Get single listing |
| POST | `/api/listings` | Yes | Create listing |
| PUT | `/api/listings/:id` | Yes | Update listing (owner only) |
| DELETE | `/api/listings/:id` | Yes | Delete listing (owner only) |
| POST | `/api/listings/:id/like` | Yes | Toggle like |

---

## Folder Structure

```
wandr/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── listingController.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── listings.js
│   │   └── index.js             # Express server entry
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/                 # Axios API helpers
    │   ├── components/          # Navbar, Footer, ListingCard
    │   ├── context/             # AuthContext (global auth state)
    │   ├── pages/               # All route pages
    │   └── App.jsx              # Routes + layout
    └── vite.config.js           # Proxy config
```

---

## Live Demo

- **Frontend:** https://wandr.vercel.app
- **Backend:** https://wandr-api.railway.app

---

*Built by [Your Name] — submitted for the Lynkerr 48-hour assignment.*
