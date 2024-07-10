const loadEnv = require("./config/env");
// Load environment variables
loadEnv();

const express = require('express');
const cors = require('cors');
const setupMiddlewares = require("./middlewares");
const fileRoutes = require('./routes/fileRoutes');
const connectDB = require("./database/connection");


// Create Express app
const app = express();

// Setup middlewares
setupMiddlewares(app);

// Enable CORS
app.use(cors())

// Routes
app.use('/files', fileRoutes);

// Connect to the database and start the server
const PORT = process.env.PORT || 6001;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`HTTP server started on port: ${PORT}`);
  });
});
