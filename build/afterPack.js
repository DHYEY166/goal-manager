const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  const appOutDir = context.appOutDir;
  const platform = context.electronPlatformName;
  
  console.log(`After pack: ${platform} at ${appOutDir}`);
  
  // Ensure backend node_modules are included
  const backendModulesSource = path.join(context.packager.projectDir, 'backend', 'node_modules');
  
  let resourcesPath;
  if (platform === 'darwin') {
    resourcesPath = path.join(appOutDir, 'Goal Manager.app', 'Contents', 'Resources');
  } else if (platform === 'win32') {
    resourcesPath = path.join(appOutDir, 'resources');
  } else {
    resourcesPath = path.join(appOutDir, 'resources');
  }
  
  const backendModulesDest = path.join(resourcesPath, 'backend', 'node_modules');
  
  console.log(`Checking backend node_modules at: ${backendModulesSource}`);
  
  if (fs.existsSync(backendModulesSource)) {
    console.log('Backend node_modules found and should be included');
  } else {
    console.warn('Backend node_modules not found! The app may not work correctly.');
  }
};
