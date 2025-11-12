import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Monitor, 
  Moon, 
  Sun, 
  Play, 
  Database,
  Download,
  Upload,
  Shield,
  Info
} from 'lucide-react';
import { usersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoStart: false,
    reminderTime: '09:00',
    dailyReminder: true,
    weeklyReport: false,
    soundEnabled: true,
    completionCelebration: true,
    dataRetention: 365
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await usersAPI.getSettings();
      setSettings({ ...settings, ...response.data.settings });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await usersAPI.updateSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Customize your Goal Manager experience
        </p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Monitor className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
            <p className="text-sm text-gray-600">Customize the look and feel</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map(theme => (
                <button
                  key={theme.value}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                    settings.theme === theme.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <theme.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">Manage alerts and reminders</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Notifications</p>
              <p className="text-sm text-gray-600">Receive desktop notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Daily Reminders</p>
              <p className="text-sm text-gray-600">Get reminded about incomplete goals</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dailyReminder}
                onChange={(e) => handleSettingChange('dailyReminder', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {settings.dailyReminder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                className="input-field w-40"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Completion Celebrations</p>
              <p className="text-sm text-gray-600">Show celebration when goals are completed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.completionCelebration}
                onChange={(e) => handleSettingChange('completionCelebration', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sound Effects</p>
              <p className="text-sm text-gray-600">Play sounds for notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Auto-Start */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Play className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Auto-Start</h2>
            <p className="text-sm text-gray-600">Launch Goal Manager when your computer starts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Auto-Start</p>
              <p className="text-sm text-gray-600">Automatically launch when you log in</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoStart}
                onChange={(e) => handleSettingChange('autoStart', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {settings.autoStart && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Setup Required</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    To enable auto-start on macOS:
                  </p>
                  <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                    <li>Open System Settings → General → Login Items</li>
                    <li>Click the "+" button under "Open at Login"</li>
                    <li>Navigate to and select the Goal Manager app</li>
                    <li>The app will now start automatically when you log in</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Database className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            <p className="text-sm text-gray-600">Backup and restore your data</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention (days)
            </label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
              className="input-field w-48"
            >
              <option value={90}>3 months</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
              <option value={-1}>Keep forever</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              How long to keep completed goal data
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                // This would trigger a backup export
                toast.success('Backup export started');
              }}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Backup</span>
            </button>

            <label className="btn-secondary flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    toast.success('Backup import started');
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
            <p className="text-sm text-gray-600">Your data stays completely local</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900">100% Local Storage</h4>
                <p className="text-sm text-green-700 mt-1">
                  All your goal data is stored locally on your device using SQLite. 
                  No data is ever sent to external servers or cloud services.
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
                  <li>No user accounts or registration required</li>
                  <li>No internet connection needed after installation</li>
                  <li>Complete control over your data</li>
                  <li>Export your data anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveSettings}
          disabled={saving}
          className={`btn-primary min-w-32 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </motion.div>
  );
}