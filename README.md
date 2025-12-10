# Image Cook

A modern full-stack web application for selecting and managing AI-generated game entity images. Built with Next.js 16, React 19, Express, TypeScript, and Firebase.

**Live Demo:** https://image-cook-frontend.vercel.app

---

## What is Image Cook?

Image Cook helps game developers streamline the process of selecting AI-generated images for their game assets. Upload multiple AI-generated image variants for each entity (enemies, items, avatars), visually compare them, and batch-confirm your favorites (in user testing sessions). The app automatically compresses and optimizes selected images for game use.

### Key Features

- **Visual Image Selection** - Browse AI-generated image variants in an intuitive card-based interface
- **Batch Operations** - Select multiple entities and confirm all at once for efficient workflow
- **Automatic Optimization** - Selected images are automatically compressed from 1024x1024 PNG to 396x396 JPEG (90% quality) - can be extended to have different configs per category (e.g. avatar, enemy, item)
- **State Persistence** - Track selections with Firebase Firestore
- **Real-time Updates** - See selection changes instantly across the interface
- **Production Ready** - Deployed with enterprise-grade security and performance
- **Enhanced Configuration** - Choose between multiple AI models (FLUX, SDXL, etc.) and adjust image counts per entity (via project config)

### Current Demo

The live demo showcases 21 game enemies with 2 AI-generated image variants each (powered by fal.ai, using FLUX-2 model). You can:
- Browse and compare 42 pre-generated enemy images
- Select your favorite version for each enemy
- Batch-confirm multiple selections
- Change your mind and reselect different variants

### Future Enhancements

- **Bulk Image Generation** - Integrate with fal.ai API to generate images directly from the app
- **Regeneration Support** - Regenerate images for specific entities without manual re-upload
- **Multiple Categories** - Extend beyond enemies to support items, avatars, and custom categories
- **Authentication Layer** - This is an admin tool, and should be behind a login. Temporarily open to public for demo purposes
- **Better Compression** - Integration with Tinify API for better image compression and resizing

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework
- **TypeScript** 
- **Tailwind CSS** - Modern utility-first styling
- **Playwright** - End-to-end testing across browsers

### Backend
- **Node.js 24**
- **Express** - Node.js framework
- **TypeScript**
- **Firebase Admin SDK** - Firestore database + Cloud Storage
- **Sharp** - High-performance image processing
- **Jest + Supertest** - Unit and integration testing

### Security
- **Helmet** - Security headers (CSP, XSS protection, etc.)
- **CORS** - Origin whitelist and credential handling
- **express-validator** - Input validation
- **Request size limits** - DoS prevention

### Infrastructure
- **Turborepo** - Monorepo build system with intelligent caching
- **Firebase Firestore** - NoSQL database for entity metadata
- **Firebase Storage** - Object storage for image files
- **Vercel** - Frontend hosting with global CDN
- **Render** - Backend hosting with auto-scaling

---

## Architecture

Image Cook uses a **monorepo architecture** with three main packages:

```
image-cook/
├── apps/
│   ├── backend/          # Express REST API
│   └── frontend/         # Next.js web application
├── packages/
│   └── shared/           # Shared TypeScript types and utilities
└── data/
    └── enemies-init.json # Entity initialization data
```

### Key Design Decisions

- **Monorepo with Turborepo** - Share types between frontend/backend while maintaining independent deployment
- **Firebase Admin SDK** - All database/storage operations through secure backend API (no client-side Firebase)
- **Server-side image processing** - Consistent, high-quality compression with Sharp (vs browser-based solutions)
- **Batch confirmation UX** - Reduces API calls and provides better workflow for bulk operations

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/entities` | Get all entities (with optional category filter) |
| POST | `/entities/init` | Initialize entities from Storage |
| POST | `/images/approve` | Approve and compress an image selection |
| POST | `/images/deselect` | Deselect current winner image |

### Data Flow

```
User selects image → Local state (pending)
  ↓
User clicks "Confirm" → POST /images/approve
  ↓
Backend downloads images from Firebase Storage → Compress with Sharp → Upload JPEG to Storage
  ↓
Update Firestore → Response to frontend
  ↓
Frontend refreshes → Display updated state
```

---

## Quick Start

### Prerequisites

- Node.js 24+ and npm 10+
- Firebase project (free tier works)
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd image-cook
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all workspaces (backend, frontend, shared).

### 3. Firebase Setup

#### Create Firebase Project

1. Go to https://console.firebase.google.com
2. Create new project named "image-cook"
3. Enable **Firestore Database** (production mode)
4. Enable **Firebase Storage**

#### Generate Service Account

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `apps/backend/firebase-service-account.json`

**Important:** This file contains sensitive credentials and is `.gitignore`d. Never commit it to Git.

#### Upload Images (Optional)

If you have pre-generated images:
1. Go to Firebase Console → Storage
2. Create folder `generated/enemy/`
3. Upload your images following the naming pattern: `{entity-name}-{model}-v{version}.png`

### 4. Configure Environment Variables

#### Backend

Create `apps/backend/.env`:

```env
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
STORAGE_BUCKET=your-project.firebasestorage.app
PORT=8531
FRONTEND_URL=http://localhost:8530
```

Replace `STORAGE_BUCKET` with your actual Firebase Storage bucket name (found in Firebase Console).

#### Frontend

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8531
API_BASE_URL=http://localhost:8531
```

### 5. Build Shared Package

The shared package must be built before the apps can import it:

```bash
npm run build --workspace @image-cook/shared
```

### 6. Start Development Servers

```bash
npm run dev
```

This starts:
- Backend: http://localhost:8531
- Frontend: http://localhost:8530

Or start individually:

```bash
# Backend only
cd apps/backend
npm run dev

# Frontend only
cd apps/frontend
npm run dev
```

### 7. Initialize Data (One-time)

With backend running, initialize entities:

```bash
curl -X POST http://localhost:8531/entities/init \
  -H "Content-Type: application/json" \
  -d @data/enemies-init.json
```

This scans Firebase Storage and creates database entries for all entities.

### 8. Open the App

Navigate to http://localhost:8530

You should see the Image Cook interface with a grid of entity cards!

---

## Development

### Common Commands

```bash
# Start all apps
npm run dev

# Build all packages and apps
npm run build

# Run all tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

### Backend Development

```bash
cd apps/backend

# Start server - This is what Render uses
npm run start
```

### Frontend Development

```bash
cd apps/frontend

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e -- --ui
```

---

## Testing

### Backend Tests
`npm run test` - unit & integration tests
`apps/backend/src/api-tests.http.example` - API tests with REST Client extension in VS Code or IntelliJ

### Frontend Tests

**End-to-End Tests** - Full user workflow with Playwright
```bash
cd apps/frontend
npm run test:e2e
```

Tests cover:
- Page loading and rendering
- Image selection interaction
- Batch confirmation workflow
- State updates and UI feedback
- Multi-browser compatibility (Chromium, Firefox, WebKit)

---

## Deployment

Both Vercel and Render are configured to be deployed automatically when there is a push.

---

## Project Structure

```
image-cook/
├── apps/
│   ├── backend/              # Express REST API
│   │   ├── src/
│   │   │   ├── config/       # Firebase initialization
│   │   │   ├── routes/       # API endpoints with validation
│   │   │   ├── services/     # Business logic (Firestore, Storage, Selection)
│   │   │   └── utils/        # Image processing
│   │   └── package.json
│   │
│   └── frontend/             # Next.js web app
│       ├── app/              # Pages and layouts
│       ├── components/       # React components
│       ├── hooks/            # Custom hooks
│       ├── lib/              # API client
│       ├── e2e/              # Playwright tests
│       └── package.json
│
├── packages/
│   └── shared/               # Shared TypeScript types and utilities
│       ├── src/
│       │   ├── types/        # Entity type definitions
│       │   └── utils/        # Name normalization
│       └── package.json
│
├── data/
│   └── enemies-init.json     # Initial entity data
│
├── turbo.json                # Turborepo configuration
└── package.json              # Root workspace
```

---

## License

All rights reserved.
