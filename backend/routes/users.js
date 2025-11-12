const express = require('express');
const router = express.Router();

// Get user settings
router.get('/settings', async (req, res) => {
  try {
    const user = await req.db.get(`
      SELECT * FROM users WHERE username = 'default_user'
    `);
    
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        settings: JSON.parse(user.settings || '{}')
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user settings
router.put('/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    
    await req.db.run(`
      UPDATE users 
      SET settings = ?
      WHERE username = 'default_user'
    `, [JSON.stringify(settings)]);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;