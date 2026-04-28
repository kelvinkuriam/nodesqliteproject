// Import the Express framework
// express is a function that creates a web server
import express from 'express'

// Import the Node.js "path" module
// path helps us work with file paths safely across operating systems (Windows, Linux, Mac)
import path, { dirname } from 'path'

// fileURLToPath converts ES module URLs to normal file system paths
// This is needed because __dirname does NOT exist in ES modules
import { fileURLToPath } from 'url'

import authRoutes from './routes/authRoutes.js';

import todoRoutes from './routes/todoRoutes.js';


// Create an Express application
// This "app" is now your server
// You use "app" to configure routes, middleware, etc.
const app = express()

// Set the port your server will run on
// process.env.PORT → used in production (like Render, Railway, Heroku)
// 5003 → fallback if no PORT is provided
const PORT = process.env.PORT || 5003



// ==============================
// __dirname FIX (IMPORTANT PART)
// ==============================

// import.meta.url gives the URL of this current file
// Example:
// file:///home/user/project/server.js
// But we need a NORMAL file path, not a URL

// fileURLToPath converts the URL to a normal file path
// Example:
// /home/user/project/server.js
const __filename = fileURLToPath(import.meta.url)


// dirname() extracts ONLY the folder path from the file path
// Example:
// /home/user/project
const __dirname = dirname(__filename)



// ==============================
// MIDDLEWARE
// ==============================


// express.json() middleware
// This allows your server to accept JSON data in requests
// Example:
// POST /users
// body: { "name": "Kelvin" }
//
// Without this middleware:
// req.body will be undefined
app.use(express.json())



// express.static middleware
// This tells Express to serve STATIC FILES from a folder
//
// Static files include:
// - HTML
// - CSS
// - JavaScript
// - images
// - fonts
//
// path.join safely joins file paths
// __dirname = current folder
// '../public' = go one level up then into public
//
// Example result:
// /project/public
//
// Now anything inside public becomes accessible:
//
// public/
//    index.html
//    style.css
//    app.js
//
// You can access them in browser:
//
// http://localhost:5003/style.css
// http://localhost:5003/app.js
//
app.use(express.static(path.join(__dirname, '../public')))



// ==============================
// ROUTES
// ==============================


// app.get() defines a GET route
// '/' means the homepage
//
// When user visits:
// http://localhost:5003/
//
// this function runs
app.get('/', (req, res) => {

    // res.sendFile sends a file to the browser
    // We send index.html

    // path.join builds the full path:
    //
    // __dirname
    // + 'public'
    // + 'index.html'
    //
    // Final example:
    // /project/public/index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/auth',authRoutes);
app.use('/todos',todoRoutes);

// ==============================
// START SERVER
// ==============================


// app.listen starts the server
// PORT = 5003
//
// callback runs once server starts
app.listen(PORT, () => {

    // Log message in terminal
    console.log(`Server has started on port: ${PORT}`)
})