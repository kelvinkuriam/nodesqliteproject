import { DatabaseSync } from 'node:sqlite';

// ✅ Use file DB (NOT memory)
const db = new DatabaseSync('database.db');

// ✅ VERY IMPORTANT: enable foreign keys
db.exec(`PRAGMA foreign_keys = ON;`);

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Todos table
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    task TEXT,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

export default db;