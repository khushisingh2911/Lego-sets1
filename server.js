/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Khushi Singh
*  Student ID: 173680216
*  Date: 2024-07-08
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require("path");
const express = require('express');
const fetch = require('node-fetch'); // Using require for CommonJS modules
const app = express();

const HTTP_PORT = process.env.PORT || 8080;



// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve home.ejs
app.get('/', (req, res) => {
  res.render('home', { page: '/' }); 
});

// Serve about.ejs
app.get('/about', (req, res) => {
  res.render('about', { page: '/about' }); 
});

// Handle requests for Lego sets
app.get("/lego/sets", async (req, res) => {
  try {
    let sets;
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    res.render('sets', { sets: sets, page: '/lego/sets' }); // Define page for sets route
  } catch (err) {
    res.status(404).render('404', { message: err.message, page: '/lego/sets' }); // Define page for error route
  }
});

// Handle requests for a specific Lego set
app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    let response = await fetch('https://api.quotable.io/random'); // Fetch a random quote from Quotable API
    let quote = await response.json();

    res.render('set', { set: set, quote: quote, page: '/lego/sets/:num' }); // Define page for set route
  } catch (err) {
    res.status(404).render('404', { message: err.message, page: '/lego/sets/:num' }); // Define page for error route
  }
});

// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found", page: req.url }); // Define page for 404 route
});

// Initialize lego data and start server
legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => { 
    console.log(`Server listening on: ${HTTP_PORT}`); 
    console.log(`http://localhost:${HTTP_PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize lego data:", err);
});
