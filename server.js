const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();


const PORT = process.env.PORT || 5050;

app.set("trust proxy", 1); // Enable trust proxy
// Increase body size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));

app.use(cors()); // Early to handle CORS headers
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json()); // Compatibility for legacy JSON parsing

app.use(helmet()); // Add security headers
app.use(mongoSanitize());              // cannot be used for express 5.1.0 version ??
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 500,
});
app.use(limiter); // Limit requests before other middleware

app.use(hpp()); // Prevent HTTP parameter pollution
app.use(cookieParser()); // Parse cookies last



// **Add the Hello World Route**
app.get('/api/v1', (req, res) => {
    res.send('Hello Worlddd');
  });


// connect to route


// Only listen on local or non-Vercel environment
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  }
  
module.exports = app;