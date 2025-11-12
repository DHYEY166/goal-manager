const notifier = require('node-notifier');

class NotificationManager {
  constructor(db) {
    this.db = db;
  }

  async sendGoalReminder(goal) {
    try {
      notifier.notify({
        title: 'Goal Reminder',
        message: `Don't forget to work on: ${goal.title}`,
        icon: process.platform === 'darwin' ? false : undefined,
        sound: true,
        wait: false
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async sendCompletionCelebration(goal) {
    try {
      notifier.notify({
        title: '🎉 Goal Completed!',
        message: `Great job! You completed: ${goal.title}`,
        icon: process.platform === 'darwin' ? false : undefined,
        sound: true,
        wait: false
      });
    } catch (error) {
      console.error('Error sending celebration notification:', error);
    }
  }

  async sendStreakMilestone(goal, streakCount) {
    try {
      let message = `${streakCount} day streak for: ${goal.title}`;
      
      if (streakCount === 7) {
        message = `🔥 7 day streak! Keep it up with: ${goal.title}`;
      } else if (streakCount === 30) {
        message = `🏆 Amazing 30 day streak for: ${goal.title}`;
      } else if (streakCount === 100) {
        message = `👑 Incredible 100 day streak for: ${goal.title}`;
      }

      notifier.notify({
        title: 'Streak Milestone!',
        message,
        icon: process.platform === 'darwin' ? false : undefined,
        sound: true,
        wait: false
      });
    } catch (error) {
      console.error('Error sending streak notification:', error);
    }
  }

  async sendDailyReminder() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const incompleteGoals = await this.db.all(`
        SELECT 
          gi.*,
          g.title,
          g.priority
        FROM goal_instances gi
        JOIN goals g ON gi.goal_id = g.id
        WHERE gi.date = ? AND gi.is_completed = 0 AND g.is_active = 1
        ORDER BY g.priority DESC
        LIMIT 3
      `, [today]);

      if (incompleteGoals.length > 0) {
        const goalTitles = incompleteGoals.map(g => g.title).join(', ');
        
        notifier.notify({
          title: 'Daily Goals Reminder',
          message: `You have ${incompleteGoals.length} goals pending: ${goalTitles}`,
          icon: process.platform === 'darwin' ? false : undefined,
          sound: false,
          wait: false
        });
      }
    } catch (error) {
      console.error('Error sending daily reminder:', error);
    }
  }
}

module.exports = { NotificationManager };