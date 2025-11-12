const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'goal_manager.db'), (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    // Users table for settings and preferences
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE DEFAULT 'default_user',
          settings TEXT DEFAULT '{}',
          created_at DATETIME DEFAULT (datetime('now', 'localtime'))
        )
      `);

      // Categories for organizing goals
      this.db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          color TEXT DEFAULT '#3B82F6',
          icon TEXT DEFAULT '🎯',
          created_at DATETIME DEFAULT (datetime('now', 'localtime'))
        )
      `);

      // Goals table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          category_id INTEGER,
          type TEXT CHECK(type IN ('daily', 'weekly', 'monthly')) NOT NULL,
          target_type TEXT CHECK(target_type IN ('quantity', 'quality')) DEFAULT 'quantity',
          target_value INTEGER DEFAULT 1,
          current_value INTEGER DEFAULT 0,
          is_recurring BOOLEAN DEFAULT true,
          is_active BOOLEAN DEFAULT true,
          priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
          streak_count INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          total_completions INTEGER DEFAULT 0,
          carryover_multiplier REAL DEFAULT 1.1,
          max_carryover_cap INTEGER DEFAULT 5,
          created_at DATETIME DEFAULT (datetime('now', 'localtime')),
          updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);

      // Daily goal instances for tracking progress
      this.db.run(`
        CREATE TABLE IF NOT EXISTS goal_instances (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal_id INTEGER NOT NULL,
          date DATE NOT NULL,
          target_value INTEGER NOT NULL,
          current_value INTEGER DEFAULT 0,
          is_completed BOOLEAN DEFAULT false,
          carried_over_from DATE,
          notes TEXT,
          completed_at DATETIME,
          created_at DATETIME DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (goal_id) REFERENCES goals (id),
          UNIQUE(goal_id, date)
        )
      `);

      // Progress entries for detailed tracking
      this.db.run(`
        CREATE TABLE IF NOT EXISTS progress_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal_instance_id INTEGER NOT NULL,
          value_added INTEGER NOT NULL,
          notes TEXT,
          timestamp DATETIME DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (goal_instance_id) REFERENCES goal_instances (id)
        )
      `);

      // Achievements and milestones
      this.db.run(`
        CREATE TABLE IF NOT EXISTS achievements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal_id INTEGER,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          achieved_at DATETIME DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY (goal_id) REFERENCES goals (id)
        )
      `);

      // Insert default categories and user
      setTimeout(() => {
        this.insertDefaultData();
      }, 100);
    });
  }

  insertDefaultData() {
    // Insert default user if not exists
    this.db.run(`
      INSERT OR IGNORE INTO users (username, settings) 
      VALUES ('default_user', '{"theme": "light", "notifications": true, "autoStart": false"}')
    `);

    // Insert default categories
    const defaultCategories = [
      { name: 'Fitness', color: '#EF4444', icon: '💪' },
      { name: 'Learning', color: '#8B5CF6', icon: '📚' },
      { name: 'Work', color: '#3B82F6', icon: '💼' },
      { name: 'Health', color: '#10B981', icon: '🏥' },
      { name: 'Personal', color: '#F59E0B', icon: '🎯' },
      { name: 'Social', color: '#EC4899', icon: '👥' }
    ];

    defaultCategories.forEach(category => {
      this.db.run(`
        INSERT OR IGNORE INTO categories (name, color, icon) 
        VALUES (?, ?, ?)
      `, [category.name, category.color, category.icon]);
    });
  }

  // Helper methods for database operations
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = Database;