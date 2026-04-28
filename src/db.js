// Import DatabaseSync from Node's built-in sqlite module
// DatabaseSync allows you to use SQLite synchronously (blocking)
// This means queries run one at a time (simpler for beginners)
import { DatabaseSync } from 'node:sqlite';


// Create a new SQLite database
// ':memory:' means the database is stored in RAM (temporary)
// This database will RESET every time you restart the server
//
// If you want persistent DB use:
// new DatabaseSync('database.db')
const db = new DatabaseSync(':memory:');



// ==============================
// CREATE USERS TABLE
// ==============================

// db.exec() executes raw SQL queries
// This SQL creates a table called "users"
// Create users table
db.exec(`
-- This table stores registered users
CREATE TABLE users(

    -- Unique ID for each user
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Username must be unique and not null
    USERNAME TEXT NOT NULL UNIQUE,

    -- Password cannot be null
    PASSWORD TEXT NOT NULL

)
`);




// Create todos table
db.exec(`

    -- This table stores todos for each user
    CREATE TABLE todos(

    -- Unique todo ID
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- This links todo to a user
    user_id INTEGER NOT NULL,

    -- The todo task text
    task TEXT,

    -- 0 = false, 1 = true
    -- Default = not completed
    completed BOOLEAN NOT NULL DEFAULT 0,

    -- Foreign key relationship
    -- user_id must exist in users table
    FOREIGN KEY (user_id) REFERENCES users(id)

)
    
`);

export default db;