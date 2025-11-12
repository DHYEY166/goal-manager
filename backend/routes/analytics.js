const express = require('express');
const router = express.Router();

// Get analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Today's stats
    const todayStats = await req.db.get(`
      SELECT 
        COUNT(*) as total_goals,
        COUNT(CASE WHEN is_completed = 1 THEN 1 END) as completed_goals,
        ROUND(COUNT(CASE WHEN is_completed = 1 THEN 1 END) * 100.0 / COUNT(*), 1) as completion_rate
      FROM goal_instances gi
      JOIN goals g ON gi.goal_id = g.id
      WHERE gi.date = ? AND g.is_active = 1
    `, [today]);

    // 7-day completion trend
    const weeklyTrend = await req.db.all(`
      SELECT 
        gi.date,
        COUNT(*) as total_goals,
        COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) as completed_goals,
        ROUND(COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) * 100.0 / COUNT(*), 1) as completion_rate
      FROM goal_instances gi
      JOIN goals g ON gi.goal_id = g.id
      WHERE gi.date >= ? AND gi.date <= ? AND g.is_active = 1
      GROUP BY gi.date
      ORDER BY gi.date DESC
    `, [sevenDaysAgo, today]);

    // Active streaks
    const activeStreaks = await req.db.all(`
      SELECT 
        g.title,
        g.streak_count,
        g.longest_streak,
        c.name as category_name,
        c.color as category_color
      FROM goals g
      LEFT JOIN categories c ON g.category_id = c.id
      WHERE g.is_active = 1 AND g.streak_count > 0
      ORDER BY g.streak_count DESC
      LIMIT 10
    `);

    // Category breakdown for the last 30 days
    const categoryStats = await req.db.all(`
      SELECT 
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        COUNT(gi.id) as total_instances,
        COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) as completed_instances,
        ROUND(COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) * 100.0 / COUNT(gi.id), 1) as completion_rate
      FROM categories c
      LEFT JOIN goals g ON c.id = g.category_id
      LEFT JOIN goal_instances gi ON g.id = gi.goal_id AND gi.date >= ?
      WHERE g.is_active = 1
      GROUP BY c.id, c.name, c.color, c.icon
      HAVING COUNT(gi.id) > 0
      ORDER BY completion_rate DESC
    `, [thirtyDaysAgo]);

    // Recent achievements
    const achievements = await req.db.all(`
      SELECT 
        a.*,
        g.title as goal_title
      FROM achievements a
      JOIN goals g ON a.goal_id = g.id
      ORDER BY a.achieved_at DESC
      LIMIT 10
    `);

    // Monthly progress heatmap data
    const heatmapData = await req.db.all(`
      SELECT 
        gi.date,
        COUNT(*) as total_goals,
        COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) as completed_goals,
        ROUND(COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) * 100.0 / COUNT(*), 1) as completion_rate
      FROM goal_instances gi
      JOIN goals g ON gi.goal_id = g.id
      WHERE gi.date >= ? AND g.is_active = 1
      GROUP BY gi.date
      ORDER BY gi.date
    `, [thirtyDaysAgo]);

    res.json({
      todayStats: todayStats || { total_goals: 0, completed_goals: 0, completion_rate: 0 },
      weeklyTrend,
      activeStreaks,
      categoryStats,
      achievements,
      heatmapData
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get detailed goal analytics
router.get('/goal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Goal details with stats
    const goalStats = await req.db.get(`
      SELECT 
        g.*,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        COUNT(gi.id) as total_instances,
        COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) as completed_instances,
        ROUND(COUNT(CASE WHEN gi.is_completed = 1 THEN 1 END) * 100.0 / COUNT(gi.id), 1) as completion_rate,
        AVG(gi.current_value) as avg_progress,
        SUM(gi.current_value) as total_progress
      FROM goals g
      LEFT JOIN categories c ON g.category_id = c.id
      LEFT JOIN goal_instances gi ON g.id = gi.goal_id AND gi.date >= ?
      WHERE g.id = ?
      GROUP BY g.id
    `, [startDate, id]);

    // Daily progress over time
    const progressHistory = await req.db.all(`
      SELECT 
        gi.date,
        gi.target_value,
        gi.current_value,
        gi.is_completed,
        ROUND((gi.current_value * 100.0 / gi.target_value), 1) as progress_percentage
      FROM goal_instances gi
      WHERE gi.goal_id = ? AND gi.date >= ?
      ORDER BY gi.date
    `, [id, startDate]);

    // Progress entries for detailed tracking
    const recentEntries = await req.db.all(`
      SELECT 
        pe.*,
        gi.date
      FROM progress_entries pe
      JOIN goal_instances gi ON pe.goal_instance_id = gi.id
      WHERE gi.goal_id = ?
      ORDER BY pe.timestamp DESC
      LIMIT 20
    `, [id]);

    if (!goalStats) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      goalStats,
      progressHistory,
      recentEntries
    });
  } catch (error) {
    console.error('Error fetching goal analytics:', error);
    res.status(500).json({ error: 'Failed to fetch goal analytics' });
  }
});

// Export data to CSV
router.get('/export', async (req, res) => {
  try {
    const { type = 'all', startDate, endDate } = req.query;
    
    let data = [];
    let filename = 'goal-manager-export';

    if (type === 'goals') {
      data = await req.db.all(`
        SELECT 
          g.*,
          c.name as category_name
        FROM goals g
        LEFT JOIN categories c ON g.category_id = c.id
        ORDER BY g.created_at DESC
      `);
      filename = 'goals-export';
    } else if (type === 'progress') {
      const whereClause = startDate && endDate 
        ? `WHERE gi.date BETWEEN '${startDate}' AND '${endDate}'`
        : '';
      
      data = await req.db.all(`
        SELECT 
          gi.*,
          g.title as goal_title,
          c.name as category_name
        FROM goal_instances gi
        JOIN goals g ON gi.goal_id = g.id
        LEFT JOIN categories c ON g.category_id = c.id
        ${whereClause}
        ORDER BY gi.date DESC
      `);
      filename = 'progress-export';
    }

    // Convert to CSV format
    if (data.length > 0) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      );
      
      const csv = [headers, ...rows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      res.json({ error: 'No data to export' });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

module.exports = router;