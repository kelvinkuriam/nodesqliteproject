import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// ✅ REGISTER
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const insertUser = db.prepare(
      `INSERT INTO users(username,password) VALUES(?,?)`
    );

    const result = insertUser.run(username, hashedPassword);

    // Default todo
    const insertToDo = db.prepare(
      `INSERT INTO todos(user_id,task) VALUES(?,?)`
    );

    insertToDo.run(result.lastInsertRowid, `Welcome ${username}!`);

    // Create token
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const getUser = db.prepare(
      `SELECT * FROM users WHERE username = ?`
    );

    const user = getUser.get(username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;