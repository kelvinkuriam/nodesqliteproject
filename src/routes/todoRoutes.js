import express from 'express';
import db from '../db.js';

const router = express.Router();

// ✅ GET TODOS
router.get('/', (req, res) => {
  const getTodos = db.prepare(
    'SELECT * FROM todos WHERE user_id = ?'
  );

  const todos = getTodos.all(req.userId);
  res.json(todos);
});

// ✅ CREATE TODO
router.post('/', (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }

  const insertTodo = db.prepare(
    `INSERT INTO todos(user_id, task) VALUES(?, ?)`
  );

  const result = insertTodo.run(req.userId, task);

  res.json({
    id: result.lastInsertRowid,
    task,
    completed: 0
  });
});

// ✅ UPDATE TODO (FIXED PROPERLY)
router.put('/:id', (req, res) => {
    const { task, completed } = req.body;
    const { id } = req.params;

    const updateTodo = db.prepare(`
        UPDATE todos
        SET task = ?, completed = ?
        WHERE id = ? AND user_id = ?
    `);

    updateTodo.run(task, completed, id, req.userId);

    res.json({ message: 'Todo updated' });
});

// ✅ DELETE TODO
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const deleteTodo = db.prepare(
    `DELETE FROM todos WHERE id = ? AND user_id = ?`
  );

  deleteTodo.run(id, req.userId);

  res.json({ message: 'Todo deleted' });
});

export default router;