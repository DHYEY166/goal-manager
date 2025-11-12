# 🎯 Goal Manager - Desktop App# 🎯 Goal Manager - Local Productivity App



A beautiful and powerful **standalone macOS desktop application** for managing your goals with adaptive tracking, intelligent carryover, and comprehensive analytics.A beautiful, feature-rich goal management application that runs completely locally on your Mac. Track daily, weekly, and monthly goals with adaptive carryover logic, streak tracking, and comprehensive analytics - all while keeping your data private and secure on your device.



![License](https://img.shields.io/badge/license-MIT-blue.svg)## ✨ Features

![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)

![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)- **🎯 Flexible Goal Setting**: Create daily, weekly, and monthly goals with custom categories

- **🔥 Adaptive Carryover**: Unfinished goals intelligently carry over with adjustable multipliers  

## ✨ Features- **📊 Rich Analytics**: Beautiful charts, heatmaps, and progress visualization

- **🏆 Achievement System**: Earn badges and track streaks for motivation

- 🎯 **Smart Goal Tracking** - Track daily, weekly, and monthly goals- **🔔 Smart Notifications**: Local reminders and celebration notifications

- 🔄 **Intelligent Carryover** - Automatically carries over incomplete goals with multipliers- **🎨 Modern UI/UX**: Clean, responsive design with smooth animations

- 📊 **Beautiful Analytics** - Detailed charts and progress visualization- **🔒 100% Local**: All data stays on your device using SQLite

- 💾 **Local-First** - All data stored locally in SQLite- **⚡ Auto-Start**: Configure to launch automatically at login

- 🖥️ **Native macOS App** - Runs independently, no browser needed

- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion## 🚀 Quick Start

- ⚡ **Real-time Updates** - Live sync across all views with React Context

- 🌙 **Background Service** - Automatic carryover processing at midnight### Prerequisites

- Node.js 16+ installed

## 🚀 Quick Start- macOS (optimized for Mac, but works on other platforms)



### For Users (Run the App)### Installation



1. **Clone the repository**:1. **Clone or download the project**:

   ```bash   ```bash

   git clone <your-repo-url>   cd /Users/dhyeydesai/Desktop/Planner/goal-manager

   cd goal-manager   ```

   ```

2. **Install all dependencies**:

2. **Build the app**:   ```bash

   ```bash   npm run setup

   ./build-app.sh   ```

   ```

3. **Start the application**:

3. **Open the app**:   ```bash

   - Find it at `dist-electron/mac-arm64/Goal Manager.app`   npm run dev

   - Or copy to Applications:   ```

     ```bash

     cp -r "dist-electron/mac-arm64/Goal Manager.app" /Applications/4. **Open your browser** to `http://localhost:3000`

     ```

The backend will run on port 5000, frontend on port 3000, and the SQLite database will be created automatically.

### For Developers

## 🛠 Manual Setup

1. **Install dependencies**:

   ```bashIf you prefer to set up manually:

   npm install

   cd backend && npm install && cd ..```bash

   cd frontend && npm install && cd ..# Install root dependencies

   ```npm install



2. **Development mode** (web version):# Install backend dependencies

   ```bashcd backend

   npm run devnpm install

   ```cd ..

   - Backend: http://localhost:5000

   - Frontend: http://localhost:5173# Install frontend dependencies  

cd frontend

3. **Build desktop app**:npm install

   ```bashcd ..

   npm run electron:build:mac

   ```# Start both backend and frontend

npm run dev

## 🏗️ Tech Stack```



### Frontend## 📱 Usage

- **React 18** - UI framework

- **Vite** - Build tool and dev server### Creating Goals

- **Tailwind CSS** - Styling1. Click **"New Goal"** on the dashboard

- **Framer Motion** - Animations2. Fill in title, description, and category

- **Headless UI** - Accessible components3. Choose goal type (daily, weekly, monthly)

- **Lucide React** - Icons4. Set target value and priority

- **React Hot Toast** - Notifications5. Configure carryover settings for daily goals

- **Recharts** - Data visualization

### Tracking Progress

### Backend- Use the **Dashboard** to see today's goals

- **Node.js** - Runtime- Click **"Add Progress"** on any goal card

- **Express** - Web framework- Adjust the value and click to update

- **SQLite3** - Database- Watch your streaks grow and achievements unlock!

- **node-cron** - Task scheduling

### Analytics & Insights

### Desktop- Visit the **Analytics** page for detailed insights

- **Electron 39** - Desktop app framework- View completion rates, streak charts, and heatmaps

- **electron-builder** - App packaging- Export your data anytime as CSV files

- Track performance across categories

## 📁 Project Structure

## 🔧 Auto-Start Configuration

```

goal-manager/To make Goal Manager launch automatically when you start your Mac:

├── backend/              # Express backend

│   ├── database.js      # SQLite database setup1. **Open System Settings** → **General** → **Login Items**

│   ├── server.js        # Express server2. Click the **"+"** button under "Open at Login"  

│   ├── routes/          # API endpoints3. Navigate to the Goal Manager application

│   │   ├── goals.js4. Select it to add to login items

│   │   ├── categories.js

│   │   ├── analytics.jsThe app will now start automatically and can run in the background.

│   │   └── users.js

│   └── services/        # Background services## 📁 Project Structure

│       ├── carryover.js

│       └── notifications.js```

├── frontend/            # React frontendgoal-manager/

│   ├── src/├── backend/          # Node.js/Express API server

│   │   ├── components/  # React components│   ├── database.js   # SQLite database setup

│   │   ├── contexts/    # React Context (global state)│   ├── server.js     # Main server file

│   │   ├── pages/       # Page components│   ├── routes/       # API route handlers

│   │   ├── hooks/       # Custom hooks│   └── services/     # Background services

│   │   └── services/    # API services├── frontend/         # React application

│   └── dist/            # Built frontend (gitignored)│   ├── src/

├── build/               # Electron build scripts│   │   ├── components/  # Reusable UI components

├── assets/              # App icons and assets│   │   ├── pages/       # Page components

├── index.js             # Electron main process│   │   ├── hooks/       # Custom React hooks

├── preload.js           # Electron preload script│   │   └── services/    # API client

├── electron-builder.json # Build configuration│   └── public/

└── build-app.sh         # Build script└── package.json      # Main project configuration

``````



## 🎯 Key Features## 💾 Data Storage



### Smart Carryover SystemAll data is stored locally in an SQLite database (`backend/goal_manager.db`). Your information includes:

The app automatically processes incomplete goals at midnight:

- Applies a **multiplier** (default 1.1x) to incomplete goals- Goals and categories

- Respects **maximum caps** to prevent unrealistic targets- Daily progress tracking

- Creates new goal instances for the next period- Achievement history  

- Prevents goal accumulation through intelligent tracking- User settings and preferences



### Global State Management**No data ever leaves your device** - complete privacy guaranteed!

Uses React Context API for seamless data sync:

- Single source of truth for all goals## 🎨 Customization

- Real-time updates across Dashboard and Goals pages

- Automatic refresh after create/edit/delete operations### Categories

- No prop drilling - clean component architectureCreate custom categories with:

- Custom names and descriptions

### Data Persistence- Color coding for visual organization

All data stored in SQLite at:- Emoji icons for personality

```

~/Library/Application Support/goal-manager-app/goal_manager.db### Goal Types

```- **Daily**: Repeat every day with carryover logic

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
