const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

// Backend server process
let serverProcess = null;
let backendReady = false;

const startServer = () => {
  return new Promise((resolve, reject) => {
    try {
      const backendPath = path.join(__dirname, 'backend');
      const serverScript = path.join(backendPath, 'server.js');
      
      console.log('🚀 Starting backend server...');
      console.log('Backend path:', backendPath);
      console.log('Server script:', serverScript);
      
      // Start the backend server as a child process
      // Compute a writable DB path for packaged app
      const userDataDir = app.getPath('userData');
      const dbFile = path.join(userDataDir, 'goal_manager.db');

      serverProcess = spawn('node', [serverScript], {
        cwd: backendPath,
        stdio: 'inherit',
        env: {
          ...process.env,
          PORT: '5000',
          NODE_ENV: 'production',
          DB_PATH: dbFile
        }
      });

      serverProcess.on('error', (error) => {
        console.error('❌ Failed to start backend server:', error);
        reject(error);
      });

      serverProcess.on('exit', (code) => {
        console.log(`Backend server exited with code ${code}`);
        backendReady = false;
      });

      // Wait for server to be ready (check health endpoint)
      let attempts = 0;
      const maxAttempts = 20;
      const checkServer = setInterval(() => {
        const http = require('http');
        const req = http.get('http://localhost:5000/api/health', (res) => {
          if (res.statusCode === 200) {
            clearInterval(checkServer);
            backendReady = true;
            console.log('✅ Backend server is ready');
            resolve();
          }
        });
        
        req.on('error', () => {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(checkServer);
            reject(new Error('Backend server failed to start'));
          }
        });
        
        req.end();
      }, 500);

    } catch (error) {
      console.error('❌ Failed to start backend server:', error);
      reject(error);
    }
  });
};

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    titleBarStyle: 'hiddenInset', // macOS style
    show: false, // Don't show until ready
    backgroundColor: '#ffffff'
  });

  // Load the app - wait for backend to be ready
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5000');
  }, 3000);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ Electron window shown');
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(async () => {
  try {
    // Start the backend server first and wait for it to be ready
    await startServer();
    
    // Create window once server is ready
    createWindow();

    // macOS specific - recreate window when dock icon clicked
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else if (mainWindow) {
        mainWindow.show();
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    dialog.showErrorBox('Startup Error', 'Failed to start Goal Manager. Please try again.');
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Kill backend process
  if (serverProcess) {
    serverProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Cleanup on quit
// Before quitting, cleanup
app.on('before-quit', () => {
  // Allow the app to quit
  if (mainWindow) {
    mainWindow.removeAllListeners('close');
  }
  
  // Kill the backend server process
  if (serverProcess) {
    console.log('🛑 Stopping backend server...');
    serverProcess.kill();
  }
});

console.log('🎯 Goal Manager Electron App Starting...');