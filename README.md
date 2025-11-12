# Goal Manager - Desktop App

A beautiful and powerful standalone macOS desktop application for managing your goals with adaptive tracking, intelligent carryover, and comprehensive analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)

## Features

- **Smart Goal Tracking** - Track daily, weekly, and monthly goals
- **Intelligent Carryover** - Automatically carries over incomplete goals with multipliers
- **Beautiful Analytics** - Detailed charts and progress visualization
- **Local-First** - All data stored locally in SQLite
- **Native macOS App** - Runs independently, no browser needed
- **Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion
- **Real-time Updates** - Live sync across all views with React Context
- **Background Service** - Automatic carryover processing at midnight

## Quick Start

### For Users (Run the App)

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd goal-manager
   ```

2. **Build the app**:
   ```bash
   ./build-app.sh
   ```

3. **Open the app**:
   - Find it at `dist-electron/mac-arm64/Goal Manager.app`
   - Or copy to Applications:
     ```bash
     cp -r "dist-electron/mac-arm64/Goal Manager.app" /Applications/
     ```

### For Developers

1. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Development mode** (web version):
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

3. **Build desktop app**:
   ```bash
   npm run electron:build:mac
   ```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Headless UI** - Accessible components
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite3** - Database
- **node-cron** - Task scheduling

### Desktop
- **Electron 39** - Desktop app framework
- **electron-builder** - App packaging

## Project Structure

```
goal-manager/
├── backend/              # Express backend
│   ├── database.js      # SQLite database setup
│   ├── server.js        # Express server
│   ├── routes/          # API endpoints
│   │   ├── goals.js
│   │   ├── categories.js
│   │   ├── analytics.js
│   │   └── users.js
│   └── services/        # Background services
│       ├── carryover.js
│       └── notifications.js
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React Context (global state)
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   └── services/    # API services
│   └── dist/            # Built frontend (gitignored)
├── build/               # Electron build scripts
├── assets/              # App icons and assets
├── index.js             # Electron main process
├── preload.js           # Electron preload script
├── electron-builder.json # Build configuration
└── build-app.sh         # Build script
```

## Key Features

### Smart Carryover System
The app automatically processes incomplete goals at midnight:
- Applies a multiplier (default 1.1x) to incomplete goals
- Respects maximum caps to prevent unrealistic targets
- Creates new goal instances for the next period
- Prevents goal accumulation through intelligent tracking

### Global State Management
Uses React Context API for seamless data sync:
- Single source of truth for all goals
- Real-time updates across Dashboard and Goals pages
- Automatic refresh after create/edit/delete operations
- No prop drilling - clean component architecture

### Data Persistence
All data stored in SQLite at:
```
~/Library/Application Support/goal-manager-app/goal_manager.db
```
- Persists between app restarts
- Survives system reboots
- Easy to backup

## Development

### Available Scripts

```bash
# Development (web mode)
npm run dev                 # Start backend + frontend
npm run dev:backend        # Backend only
npm run dev:frontend       # Frontend only

# Building
npm run build              # Build frontend for production
npm run electron:build:mac # Build macOS app
./build-app.sh             # Complete build script

# Production
npm start                  # Start production backend
```

### Building the Desktop App

The desktop app bundles everything:
1. Frontend (built and bundled)
2. Backend server (included with dependencies)
3. SQLite database (created on first run)
4. Electron wrapper (native macOS app)

```bash
# Complete build process
./build-app.sh

# Manual build steps
cd frontend && npm run build && cd ..
npx electron-builder --mac --arm64
```

## API Endpoints

### Goals
- `GET /api/goals` - Get all goals with today's progress
- `GET /api/goals/:id` - Get single goal details
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Goal Progress
- `POST /api/goals/:id/progress` - Update daily progress
- `GET /api/goals/today` - Get today's goal instances

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Analytics
- `GET /api/analytics/summary` - Overall statistics
- `GET /api/analytics/trends` - Progress trends over time

## Database Schema

```sql
-- Main goals table
goals (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  type TEXT CHECK(type IN ('daily', 'weekly', 'monthly')),
  target_value INTEGER DEFAULT 1,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
  is_active BOOLEAN DEFAULT 1,
  carryover_multiplier REAL DEFAULT 1.1,
  max_carryover_cap INTEGER DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- Daily tracking
goal_instances (
  id INTEGER PRIMARY KEY,
  goal_id INTEGER,
  date DATE NOT NULL,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT 0,
  is_carried_over BOOLEAN DEFAULT 0,
  previous_target INTEGER
)

-- Categories
categories (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT,
  icon TEXT
)
```

## Distribution

After building, you get:
- `dist-electron/mac-arm64/Goal Manager.app` - The app bundle (arm64/Apple Silicon)
- Ready to copy to `/Applications` folder
- Can be distributed as-is (no installer needed for testing)

For production distribution:
- Consider code signing with Apple Developer certificate
- Create DMG installer by changing target in `electron-builder.json`
- Notarize the app for Gatekeeper

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with React, Node.js, and Electron
- Icons by [Lucide](https://lucide.dev/)
- UI components from [Headless UI](https://headlessui.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Date utilities from [date-fns](https://date-fns.org/)

---

**Made for productivity enthusiasts**
