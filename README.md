# Goal Manager - Desktop App# 🎯 Goal Manager - Desktop App# 🎯 Goal Manager - Local Productivity App



A beautiful and powerful **standalone macOS desktop application** for managing your goals with adaptive tracking, intelligent carryover, and comprehensive analytics.



![License](https://img.shields.io/badge/license-MIT-blue.svg)A beautiful and powerful **standalone macOS desktop application** for managing your goals with adaptive tracking, intelligent carryover, and comprehensive analytics.A beautiful, feature-rich goal management application that runs completely locally on your Mac. Track daily, weekly, and monthly goals with adaptive carryover logic, streak tracking, and comprehensive analytics - all while keeping your data private and secure on your device.

![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)

![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)



## Features![License](https://img.shields.io/badge/license-MIT-blue.svg)## ✨ Features



- **Smart Goal Tracking** - Track daily, weekly, and monthly goals![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)

- **Intelligent Carryover** - Automatically carries over incomplete goals with multipliers

- **Beautiful Analytics** - Detailed charts and progress visualization![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)- **🎯 Flexible Goal Setting**: Create daily, weekly, and monthly goals with custom categories

- **Local-First** - All data stored locally in SQLite

- **Native macOS App** - Runs independently, no browser needed- **🔥 Adaptive Carryover**: Unfinished goals intelligently carry over with adjustable multipliers  

- **Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion

- **Real-time Updates** - Live sync across all views with React Context## ✨ Features- **📊 Rich Analytics**: Beautiful charts, heatmaps, and progress visualization

- **Background Service** - Automatic carryover processing at midnight

- **🏆 Achievement System**: Earn badges and track streaks for motivation

## Quick Start

- 🎯 **Smart Goal Tracking** - Track daily, weekly, and monthly goals- **🔔 Smart Notifications**: Local reminders and celebration notifications

### For Users (Run the App)

- 🔄 **Intelligent Carryover** - Automatically carries over incomplete goals with multipliers- **🎨 Modern UI/UX**: Clean, responsive design with smooth animations

1. **Clone the repository**:

   ```bash- 📊 **Beautiful Analytics** - Detailed charts and progress visualization- **🔒 100% Local**: All data stays on your device using SQLite

   git clone <your-repo-url>

   cd goal-manager- 💾 **Local-First** - All data stored locally in SQLite- **⚡ Auto-Start**: Configure to launch automatically at login

   ```

- 🖥️ **Native macOS App** - Runs independently, no browser needed

2. **Build the app**:

   ```bash- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion## 🚀 Quick Start

   ./build-app.sh

   ```- ⚡ **Real-time Updates** - Live sync across all views with React Context



3. **Open the app**:- 🌙 **Background Service** - Automatic carryover processing at midnight### Prerequisites

   - Find it at `dist-electron/mac-arm64/Goal Manager.app`

   - Or copy to Applications:- Node.js 16+ installed

     ```bash

     cp -r "dist-electron/mac-arm64/Goal Manager.app" /Applications/## 🚀 Quick Start- macOS (optimized for Mac, but works on other platforms)

     ```



### For Developers

### For Users (Run the App)### Installation

1. **Install dependencies**:

   ```bash

   npm install

   cd backend && npm install && cd ..1. **Clone the repository**:1. **Clone or download the project**:

   cd frontend && npm install && cd ..

   ```   ```bash   ```bash



2. **Development mode** (web version):   git clone <your-repo-url>   cd /Users/dhyeydesai/Desktop/Planner/goal-manager

   ```bash

   npm run dev   cd goal-manager   ```

   ```

   - Backend: http://localhost:5000   ```

   - Frontend: http://localhost:5173

2. **Install all dependencies**:

3. **Build desktop app**:

   ```bash2. **Build the app**:   ```bash

   npm run electron:build:mac

   ```   ```bash   npm run setup



## Tech Stack   ./build-app.sh   ```



### Frontend   ```

- **React 18** - UI framework

- **Vite** - Build tool and dev server3. **Start the application**:

- **Tailwind CSS** - Styling

- **Framer Motion** - Animations3. **Open the app**:   ```bash

- **Headless UI** - Accessible components

- **Lucide React** - Icons   - Find it at `dist-electron/mac-arm64/Goal Manager.app`   npm run dev

- **React Hot Toast** - Notifications

- **Recharts** - Data visualization   - Or copy to Applications:   ```



### Backend     ```bash

- **Node.js** - Runtime

- **Express** - Web framework     cp -r "dist-electron/mac-arm64/Goal Manager.app" /Applications/4. **Open your browser** to `http://localhost:3000`

- **SQLite3** - Database

- **node-cron** - Task scheduling     ```



### DesktopThe backend will run on port 5000, frontend on port 3000, and the SQLite database will be created automatically.

- **Electron 39** - Desktop app framework

- **electron-builder** - App packaging### For Developers



## Project Structure## 🛠 Manual Setup



```1. **Install dependencies**:

goal-manager/

├── backend/              # Express backend   ```bashIf you prefer to set up manually:

│   ├── database.js      # SQLite database setup

│   ├── server.js        # Express server   npm install

│   ├── routes/          # API endpoints

│   │   ├── goals.js   cd backend && npm install && cd ..```bash

│   │   ├── categories.js

│   │   ├── analytics.js   cd frontend && npm install && cd ..# Install root dependencies

│   │   └── users.js

│   └── services/        # Background services   ```npm install

│       ├── carryover.js

│       └── notifications.js

├── frontend/            # React frontend

│   ├── src/2. **Development mode** (web version):# Install backend dependencies

│   │   ├── components/  # React components

│   │   ├── contexts/    # React Context (global state)   ```bashcd backend

│   │   ├── pages/       # Page components

│   │   ├── hooks/       # Custom hooks   npm run devnpm install

│   │   └── services/    # API services

│   └── dist/            # Built frontend (gitignored)   ```cd ..

├── build/               # Electron build scripts

├── assets/              # App icons and assets   - Backend: http://localhost:5000

├── index.js             # Electron main process

├── preload.js           # Electron preload script   - Frontend: http://localhost:5173# Install frontend dependencies  

├── electron-builder.json # Build configuration

└── build-app.sh         # Build scriptcd frontend

```

3. **Build desktop app**:npm install

## Key Features

   ```bashcd ..

### Smart Carryover System

The app automatically processes incomplete goals at midnight:   npm run electron:build:mac

- Applies a **multiplier** (default 1.1x) to incomplete goals

- Respects **maximum caps** to prevent unrealistic targets   ```# Start both backend and frontend

- Creates new goal instances for the next period

- Prevents goal accumulation through intelligent trackingnpm run dev



### Global State Management## 🏗️ Tech Stack```

Uses React Context API for seamless data sync:

- Single source of truth for all goals

- Real-time updates across Dashboard and Goals pages

- Automatic refresh after create/edit/delete operations### Frontend## 📱 Usage

- No prop drilling - clean component architecture

- **React 18** - UI framework

### Data Persistence

All data stored in SQLite at:- **Vite** - Build tool and dev server### Creating Goals

```

~/Library/Application Support/goal-manager-app/goal_manager.db- **Tailwind CSS** - Styling1. Click **"New Goal"** on the dashboard

```

- Persists between app restarts- **Framer Motion** - Animations2. Fill in title, description, and category

- Survives system reboots

- Easy to backup- **Headless UI** - Accessible components3. Choose goal type (daily, weekly, monthly)



## Development- **Lucide React** - Icons4. Set target value and priority



### Available Scripts- **React Hot Toast** - Notifications5. Configure carryover settings for daily goals



```bash- **Recharts** - Data visualization

# Development (web mode)

npm run dev                 # Start backend + frontend### Tracking Progress

npm run dev:backend        # Backend only

npm run dev:frontend       # Frontend only### Backend- Use the **Dashboard** to see today's goals



# Building- **Node.js** - Runtime- Click **"Add Progress"** on any goal card

npm run build              # Build frontend for production

npm run electron:build:mac # Build macOS app- **Express** - Web framework- Adjust the value and click to update

./build-app.sh             # Complete build script

- **SQLite3** - Database- Watch your streaks grow and achievements unlock!

# Production

npm start                  # Start production backend- **node-cron** - Task scheduling

```

### Analytics & Insights

### Building the Desktop App

### Desktop- Visit the **Analytics** page for detailed insights

The desktop app bundles everything:

1. Frontend (built and bundled)- **Electron 39** - Desktop app framework- View completion rates, streak charts, and heatmaps

2. Backend server (included with dependencies)

3. SQLite database (created on first run)- **electron-builder** - App packaging- Export your data anytime as CSV files

4. Electron wrapper (native macOS app)

- Track performance across categories

```bash

# Complete build process## 📁 Project Structure

./build-app.sh

## 🔧 Auto-Start Configuration

# Manual build steps

cd frontend && npm run build && cd ..```

npx electron-builder --mac --arm64

```goal-manager/To make Goal Manager launch automatically when you start your Mac:



## API Endpoints├── backend/              # Express backend



### Goals│   ├── database.js      # SQLite database setup1. **Open System Settings** → **General** → **Login Items**

- `GET /api/goals` - Get all goals with today's progress

- `GET /api/goals/:id` - Get single goal details│   ├── server.js        # Express server2. Click the **"+"** button under "Open at Login"  

- `POST /api/goals` - Create new goal

- `PUT /api/goals/:id` - Update goal│   ├── routes/          # API endpoints3. Navigate to the Goal Manager application

- `DELETE /api/goals/:id` - Delete goal

│   │   ├── goals.js4. Select it to add to login items

### Goal Progress

- `POST /api/goals/:id/progress` - Update daily progress│   │   ├── categories.js

- `GET /api/goals/today` - Get today's goal instances

│   │   ├── analytics.jsThe app will now start automatically and can run in the background.

### Categories

- `GET /api/categories` - Get all categories│   │   └── users.js

- `POST /api/categories` - Create category

│   └── services/        # Background services## 📁 Project Structure

### Analytics

- `GET /api/analytics/summary` - Overall statistics│       ├── carryover.js

- `GET /api/analytics/trends` - Progress trends over time

│       └── notifications.js```

## Database Schema

├── frontend/            # React frontendgoal-manager/

```sql

-- Main goals table│   ├── src/├── backend/          # Node.js/Express API server

goals (

  id INTEGER PRIMARY KEY,│   │   ├── components/  # React components│   ├── database.js   # SQLite database setup

  title TEXT NOT NULL,

  description TEXT,│   │   ├── contexts/    # React Context (global state)│   ├── server.js     # Main server file

  category_id INTEGER,

  type TEXT CHECK(type IN ('daily', 'weekly', 'monthly')),│   │   ├── pages/       # Page components│   ├── routes/       # API route handlers

  target_value INTEGER DEFAULT 1,

  priority TEXT CHECK(priority IN ('low', 'medium', 'high')),│   │   ├── hooks/       # Custom hooks│   └── services/     # Background services

  is_active BOOLEAN DEFAULT 1,

  carryover_multiplier REAL DEFAULT 1.1,│   │   └── services/    # API services├── frontend/         # React application

  max_carryover_cap INTEGER DEFAULT 5,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP│   └── dist/            # Built frontend (gitignored)│   ├── src/

)

├── build/               # Electron build scripts│   │   ├── components/  # Reusable UI components

-- Daily tracking

goal_instances (├── assets/              # App icons and assets│   │   ├── pages/       # Page components

  id INTEGER PRIMARY KEY,

  goal_id INTEGER,├── index.js             # Electron main process│   │   ├── hooks/       # Custom React hooks

  date DATE NOT NULL,

  target_value INTEGER,├── preload.js           # Electron preload script│   │   └── services/    # API client

  current_value INTEGER DEFAULT 0,

  is_completed BOOLEAN DEFAULT 0,├── electron-builder.json # Build configuration│   └── public/

  is_carried_over BOOLEAN DEFAULT 0,

  previous_target INTEGER└── build-app.sh         # Build script└── package.json      # Main project configuration

)

``````

-- Categories

categories (

  id INTEGER PRIMARY KEY,

  name TEXT UNIQUE NOT NULL,## 🎯 Key Features## 💾 Data Storage

  color TEXT,

  icon TEXT

)

```### Smart Carryover SystemAll data is stored locally in an SQLite database (`backend/goal_manager.db`). Your information includes:



## DistributionThe app automatically processes incomplete goals at midnight:



After building, you get:- Applies a **multiplier** (default 1.1x) to incomplete goals- Goals and categories

- `dist-electron/mac-arm64/Goal Manager.app` - The app bundle (arm64/Apple Silicon)

- Ready to copy to `/Applications` folder- Respects **maximum caps** to prevent unrealistic targets- Daily progress tracking

- Can be distributed as-is (no installer needed for testing)

- Creates new goal instances for the next period- Achievement history  

For production distribution:

- Consider code signing with Apple Developer certificate- Prevents goal accumulation through intelligent tracking- User settings and preferences

- Create DMG installer by changing target in `electron-builder.json`

- Notarize the app for Gatekeeper



## Contributing### Global State Management**No data ever leaves your device** - complete privacy guaranteed!



1. Fork the repositoryUses React Context API for seamless data sync:

2. Create your feature branch: `git checkout -b feature/amazing-feature`

3. Commit your changes: `git commit -m 'Add amazing feature'`- Single source of truth for all goals## 🎨 Customization

4. Push to the branch: `git push origin feature/amazing-feature`

5. Open a Pull Request- Real-time updates across Dashboard and Goals pages



## License- Automatic refresh after create/edit/delete operations### Categories



MIT License - feel free to use this project for personal or commercial purposes.- No prop drilling - clean component architectureCreate custom categories with:



## Acknowledgments- Custom names and descriptions



- Built with React, Node.js, and Electron### Data Persistence- Color coding for visual organization

- Icons by [Lucide](https://lucide.dev/)

- UI components from [Headless UI](https://headlessui.com/)All data stored in SQLite at:- Emoji icons for personality

- Charts powered by [Recharts](https://recharts.org/)

- Date utilities from [date-fns](https://date-fns.org/)```



---~/Library/Application Support/goal-manager-app/goal_manager.db### Goal Types



**Made for productivity enthusiasts**```- **Daily**: Repeat every day with carryover logic


- Persists between app restarts- **Weekly**: Track weekly objectives  

- Survives system reboots- **Monthly**: Long-term monthly targets

- Easy to backup

### Carryover Logic

## 🛠️ DevelopmentDaily goals support adaptive carryover:

- **Multiplier**: How much incomplete work increases (default 1.1x)

### Available Scripts- **Cap**: Maximum additional amount (default 5)

- Prevents unrealistic goal inflation

```bash

# Development (web mode)## 🔔 Notifications

npm run dev                 # Start backend + frontend

npm run dev:backend        # Backend onlyThe app supports native macOS notifications for:

npm run dev:frontend       # Frontend only- Daily goal reminders

- Completion celebrations  

# Building- Streak milestones

npm run build              # Build frontend for production- Weekly progress summaries

npm run electron:build:mac # Build macOS app

./build-app.sh             # Complete build scriptConfigure timing and preferences in Settings.



# Production## 🚨 Troubleshooting

npm start                  # Start production backend

```### Common Issues



### Building the Desktop App**App won't start:**

```bash

The desktop app bundles everything:# Check if ports are available

1. Frontend (built and bundled)lsof -i :3000

2. Backend server (included with dependencies)lsof -i :5000

3. SQLite database (created on first run)

4. Electron wrapper (native macOS app)# Kill any conflicting processes

kill -9 <PID>

```bash```

# Complete build process

./build-app.sh**Database errors:**

- Delete `backend/goal_manager.db` to reset (loses data)

# Manual build steps- Check file permissions in the backend folder

cd frontend && npm run build && cd ..

npx electron-builder --mac --arm64**Missing dependencies:**

``````bash

# Clean install

## 📡 API Endpointsrm -rf node_modules package-lock.json

cd backend && rm -rf node_modules package-lock.json && cd ..

### Goalscd frontend && rm -rf node_modules package-lock.json && cd .. 

- `GET /api/goals` - Get all goals with today's progressnpm run setup

- `GET /api/goals/:id` - Get single goal details```

- `POST /api/goals` - Create new goal

- `PUT /api/goals/:id` - Update goal### Performance Tips

- `DELETE /api/goals/:id` - Delete goal

- Close unused browser tabs when running

### Goal Progress- The app uses minimal resources in background mode

- `POST /api/goals/:id/progress` - Update daily progress- Database is optimized for fast local queries

- `GET /api/goals/today` - Get today's goal instances- Modern animations may use GPU acceleration



### Categories## 📈 Advanced Features

- `GET /api/categories` - Get all categories

- `POST /api/categories` - Create category### API Endpoints

The backend provides RESTful APIs:

### Analytics- `GET/POST /api/goals` - Goal management

- `GET /api/analytics/summary` - Overall statistics- `GET /api/analytics/dashboard` - Analytics data  

- `GET /api/analytics/trends` - Progress trends over time- `GET/POST /api/categories` - Category management

- `GET/PUT /api/users/settings` - User preferences

## 🗄️ Database Schema

### Export/Import

```sql- Export all data as CSV from Analytics page

-- Main goals table- Backup database file manually from `backend/goal_manager.db`

goals (- Import feature available in Settings (JSON format)

  id INTEGER PRIMARY KEY,

  title TEXT NOT NULL,---

  description TEXT,

  category_id INTEGER,## 🎉 Start Tracking Your Goals!

  type TEXT CHECK(type IN ('daily', 'weekly', 'monthly')),

  target_value INTEGER DEFAULT 1,Launch the app and create your first goal to begin your productivity journey. The beautiful interface and smart features will help you build lasting habits and achieve your objectives.

  priority TEXT CHECK(priority IN ('low', 'medium', 'high')),

  is_active BOOLEAN DEFAULT 1,**Remember**: This app works completely offline and keeps all your data private on your Mac. Perfect for focused productivity without distractions!
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

## 🚢 Distribution

After building, you get:
- `dist-electron/mac-arm64/Goal Manager.app` - The app bundle (arm64/Apple Silicon)
- Ready to copy to `/Applications` folder
- Can be distributed as-is (no installer needed for testing)

For production distribution:
- Consider code signing with Apple Developer certificate
- Create DMG installer by changing target in `electron-builder.json`
- Notarize the app for Gatekeeper

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with ❤️ using React, Node.js, and Electron
- Icons by [Lucide](https://lucide.dev/)
- UI components from [Headless UI](https://headlessui.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Date utilities from [date-fns](https://date-fns.org/)

---

**Made with 🎯 for productivity enthusiasts**
