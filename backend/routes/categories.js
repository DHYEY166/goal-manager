const express = require('express');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await req.db.all(`
      SELECT c.*, COUNT(g.id) as goal_count
      FROM categories c
      LEFT JOIN goals g ON c.id = g.category_id AND g.is_active = 1
      GROUP BY c.id
      ORDER BY c.name
    `);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, color = '#3B82F6', icon = '🎯' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await req.db.run(`
      INSERT INTO categories (name, color, icon)
      VALUES (?, ?, ?)
    `, [name, color, icon]);

    const newCategory = await req.db.get(`
      SELECT * FROM categories WHERE id = ?
    `, [result.id]);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    await req.db.run(`
      UPDATE categories 
      SET name = ?, color = ?, icon = ?
      WHERE id = ?
    `, [name, color, icon, id]);

    const updatedCategory = await req.db.get(`
      SELECT * FROM categories WHERE id = ?
    `, [id]);

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has goals
    const goalCount = await req.db.get(`
      SELECT COUNT(*) as count FROM goals WHERE category_id = ? AND is_active = 1
    `, [id]);

    if (goalCount.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with active goals. Please reassign or delete goals first.' 
      });
    }

    await req.db.run(`DELETE FROM categories WHERE id = ?`, [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;