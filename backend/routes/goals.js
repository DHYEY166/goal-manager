const express = require('express');
const router = express.Router();

// Get all goals
router.get('/', async (req, res) => {
  try {
    const goals = await req.db.all(`
      SELECT g.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM goals g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.is_active = 1
      ORDER BY g.priority DESC, g.created_at DESC
    `);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Get today's goal instances
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const goalInstances = await req.db.all(`
      SELECT 
        gi.*,
        g.title,
        g.description,
        g.type,
        g.target_type,
        g.priority,
        g.streak_count,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM goal_instances gi
      JOIN goals g ON gi.goal_id = g.id
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE gi.date = ? AND g.is_active = 1
      ORDER BY g.priority DESC, gi.created_at ASC
    `, [today]);

    res.json(goalInstances);
  } catch (error) {
    console.error('Error fetching today\'s goals:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s goals' });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      type,
      target_type = 'quantity',
      target_value = 1,
      is_recurring = true,
      priority = 'medium',
      carryover_multiplier = 1.1,
      max_carryover_cap = 5
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    const result = await req.db.run(`
      INSERT INTO goals (
        title, description, category_id, type, target_type, target_value,
        is_recurring, priority, carryover_multiplier, max_carryover_cap, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      title, description, category_id, type, target_type, target_value,
      is_recurring, priority, carryover_multiplier, max_carryover_cap
    ]);

    // Create today's instance if it's a daily goal
    if (type === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      await req.db.run(`
        INSERT OR IGNORE INTO goal_instances (goal_id, date, target_value)
        VALUES (?, ?, ?)
      `, [result.id, today, target_value]);
    }

    const newGoal = await req.db.get(`
      SELECT g.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM goals g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.id = ?
    `, [result.id]);

    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal progress
router.post('/:goalId/progress', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { value, notes, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Get or create goal instance for the date
    let instance = await req.db.get(`
      SELECT * FROM goal_instances WHERE goal_id = ? AND date = ?
    `, [goalId, targetDate]);

    if (!instance) {
      const goal = await req.db.get('SELECT * FROM goals WHERE id = ?', [goalId]);
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      const result = await req.db.run(`
        INSERT INTO goal_instances (goal_id, date, target_value)
        VALUES (?, ?, ?)
      `, [goalId, targetDate, goal.target_value]);

      instance = { id: result.id, goal_id: goalId, date: targetDate, target_value: goal.target_value, current_value: 0 };
    }

    // Add progress entry
    await req.db.run(`
      INSERT INTO progress_entries (goal_instance_id, value_added, notes)
      VALUES (?, ?, ?)
    `, [instance.id, value, notes]);

    // Update instance current value
    const newCurrentValue = instance.current_value + value;
    const isCompleted = newCurrentValue >= instance.target_value;

    await req.db.run(`
      UPDATE goal_instances 
      SET current_value = ?, is_completed = ?, completed_at = ?
      WHERE id = ?
    `, [newCurrentValue, isCompleted, isCompleted ? new Date().toISOString() : null, instance.id]);

    // Update goal stats if completed
    if (isCompleted && !instance.is_completed) {
      const goal = await req.db.get('SELECT * FROM goals WHERE id = ?', [goalId]);
      const newStreakCount = goal.streak_count + 1;
      const newLongestStreak = Math.max(goal.longest_streak, newStreakCount);
      const newTotalCompletions = goal.total_completions + 1;

      await req.db.run(`
        UPDATE goals 
        SET streak_count = ?, longest_streak = ?, total_completions = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [newStreakCount, newLongestStreak, newTotalCompletions, goalId]);

      // Check for achievements
      if (newStreakCount === 7) {
        await req.db.run(`
          INSERT INTO achievements (goal_id, type, title, description)
          VALUES (?, 'streak', '7-Day Streak!', 'Completed goal for 7 consecutive days')
        `, [goalId]);
      }
    }

    // Get updated instance
    const updatedInstance = await req.db.get(`
      SELECT 
        gi.*,
        g.title,
        g.description,
        g.type,
        g.target_type,
        g.priority,
        g.streak_count,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon
      FROM goal_instances gi
      JOIN goals g ON gi.goal_id = g.id
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE gi.id = ?
    `, [instance.id]);

    res.json(updatedInstance);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Update a goal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category_id,
      target_value,
      priority,
      is_active,
      carryover_multiplier,
      max_carryover_cap
    } = req.body;

    await req.db.run(`
      UPDATE goals 
      SET title = ?, description = ?, category_id = ?, target_value = ?, 
          priority = ?, is_active = ?, carryover_multiplier = ?, 
          max_carryover_cap = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, category_id, target_value, priority, is_active, carryover_multiplier, max_carryover_cap, id]);

    // Also update today's goal instance if it exists and target_value changed
    if (target_value !== undefined) {
      const today = new Date().toISOString().split('T')[0];
      await req.db.run(`
        UPDATE goal_instances 
        SET target_value = ?
        WHERE goal_id = ? AND date = ?
      `, [target_value, id, today]);
    }

    const updatedGoal = await req.db.get(`
      SELECT g.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM goals g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.id = ?
    `, [id]);

    res.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete a goal (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await req.db.run(`
      UPDATE goals SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `, [id]);

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// Get goal history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 30 } = req.query;

    const history = await req.db.all(`
      SELECT 
        gi.*,
        DATE(gi.date) as formatted_date
      FROM goal_instances gi
      WHERE gi.goal_id = ?
      ORDER BY gi.date DESC
      LIMIT ?
    `, [id, limit]);

    res.json(history);
  } catch (error) {
    console.error('Error fetching goal history:', error);
    res.status(500).json({ error: 'Failed to fetch goal history' });
  }
});

module.exports = router;