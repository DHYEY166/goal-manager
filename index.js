const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn, fork } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

// Start the Express backend server
function startBackendServer() {
  return new Promise((resolve, reject) => {
    // Determine the correct path for backend
    let backendPath;
    let backendCwd;
    
    if (app.isPackaged) {
      // In packaged app, backend is in app folder (no asar)
      backendPath = path.join(process.resourcesPath, 'app', 'backend', 'server.js');
      backendCwd = path.join(process.resourcesPath, 'app', 'backend');
      
      // Check if path exists
      console.log('Packaged mode - Backend path:', backendPath);
      console.log('Backend CWD:', backendCwd);
      console.log('Path exists:', fs.existsSync(backendPath));
    } else {
      // In development, backend is relative to __dirname
      backendPath = path.join(__dirname, 'backend', 'server.js');
      backendCwd = path.join(__dirname, 'backend');
      console.log('Development mode - Backend path:', backendPath);
    }
    
    // Use fork instead of spawn for better process handling
    try {
      serverProcess = fork(backendPath, [], {
        cwd: backendCwd,
        env: { ...process.env, PORT: '5000' },
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
      });

      serverProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
        if (data.toString().includes('Goal Manager Server running')) {
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
      });

      serverProcess.on('error', (error) => {
        console.error('Failed to start backend server:', error);
        reject(error);
      });

      serverProcess.on('exit', (code) => {
        console.log(`Backend process exited with code ${code}`);
      });

      // Resolve after 3 seconds even if we don't see the success message
      setTimeout(resolve, 3000);
    } catch (error) {
      console.error('Error spawning backend:', error);
      reject(error);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0f172a',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    title: 'Goal Manager'
  });

  // Create application menu
  const template = [
    {
      label: 'Goal Manager',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Load the app from localhost (backend serves the frontend)
  // Wait a bit for the backend to start
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5000')
      .then(() => {
        console.log('Frontend loaded successfully');
      })
      .catch((err) => {
        console.error('Failed to load frontend:', err);
        // Fallback: try loading from file
        const indexPath = app.isPackaged
          ? path.join(process.resourcesPath, 'app', 'frontend', 'dist', 'index.html')
          : path.join(__dirname, 'frontend', 'dist', 'index.html');
        console.log('Trying to load from file:', indexPath);
        mainWindow.loadFile(indexPath);
      });
  }, 3000); // Give backend more time to start

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  try {
    // Start backend server first
    console.log('Starting backend server...');
    await startBackendServer();
    console.log('Backend server started successfully');
    
    // Then create the window
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill the backend server process
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill the backend server process
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Handle app quit
app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
