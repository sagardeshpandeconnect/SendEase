const express = require("express");
const loadEnv = require("./config/env");
const connectDB = require("./database/connection");
const setupMiddlewares = require("./middlewares");
const setupRoutes = require("./routes");
const { uploadDataToDatabase } = require("./services/uploadData");


// Load environment variables
loadEnv();

// Create Express app
const app = express();

// Setup middlewares
setupMiddlewares(app);

// Setup routes
setupRoutes(app);

// Connect to the database and start the server
const PORT = process.env.PORT || 6001;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
});

// Function to upload file to database
uploadDataToDatabase();
