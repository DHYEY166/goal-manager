const cron = require('node-cron');

class CarryoverService {
  constructor(db) {
    this.db = db;
    this.job = null;
  }

  start() {
    // Run at 12:01 AM every day
    this.job = cron.schedule('1 0 * * *', () => {
      this.processCarryovers();
    });
    
    console.log('🕒 Carryover service started - runs daily at 12:01 AM');
    
    // Also process carryovers on startup
    this.processCarryovers();
  }

  stop() {
    if (this.job) {
      this.job.stop();
      console.log('Carryover service stopped');
    }
  }

  async processCarryovers() {
    try {
      console.log('🔄 Processing goal carryovers...');
      
      // Wait a bit for database to be ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      // Get all incomplete daily goals from yesterday
      const incompleteGoals = await this.db.all(`
        SELECT 
          gi.*,
          g.carryover_multiplier,
          g.max_carryover_cap,
          g.target_value as original_target,
          g.is_recurring
        FROM goal_instances gi
        JOIN goals g ON gi.goal_id = g.id
        WHERE gi.date = ? AND gi.is_completed = 0 AND g.is_active = 1 AND g.type = 'daily'
      `, [yesterday]).catch(err => {
        console.log('No goal instances found or tables not ready yet');
        return [];
      });

      for (const instance of incompleteGoals) {
        if (!instance.is_recurring) continue;

        // Calculate carryover amount
        const remainingAmount = instance.target_value - instance.current_value;
        const carryoverAmount = Math.ceil(remainingAmount * instance.carryover_multiplier);
        const cappedCarryover = Math.min(carryoverAmount, instance.max_carryover_cap);
        
        // Calculate new target for today
        const newTarget = instance.original_target + cappedCarryover;

        // Create or update today's goal instance
        await this.db.run(`
          INSERT OR REPLACE INTO goal_instances (
            goal_id, date, target_value, current_value, carried_over_from
          ) VALUES (?, ?, ?, 0, ?)
        `, [instance.goal_id, today, newTarget, yesterday]);

        // Break streak for incomplete goals
        await this.db.run(`
          UPDATE goals 
          SET streak_count = 0, updated_at = datetime('now','localtime')
          WHERE id = ?
        `, [instance.goal_id]);

        console.log(`📈 Carried over goal ${instance.goal_id}: ${remainingAmount} -> ${cappedCarryover} (new target: ${newTarget})`);
      }

      // Create today's instances for all other active daily goals
      await this.createTodayInstances();

      console.log('✅ Carryover processing completed');
    } catch (error) {
      console.error('Error processing carryovers:', error);
    }
  }

  async createTodayInstances() {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get all active daily goals that don't have today's instance yet
      const activeGoals = await this.db.all(`
        SELECT g.* 
        FROM goals g
        LEFT JOIN goal_instances gi ON g.id = gi.goal_id AND gi.date = ?
        WHERE g.is_active = 1 AND g.type = 'daily' AND gi.id IS NULL
      `, [today]);

      for (const goal of activeGoals) {
        await this.db.run(`
          INSERT INTO goal_instances (goal_id, date, target_value, current_value)
          VALUES (?, ?, ?, 0)
        `, [goal.id, today, goal.target_value]);
        
        console.log(`📅 Created today's instance for goal: ${goal.title}`);
      }
    } catch (error) {
      console.error('Error creating today\'s instances:', error);
    }
  }

  // Manual trigger for testing
  async triggerCarryover() {
    await this.processCarryovers();
  }
}

module.exports = { CarryoverService };