const loadEnv = require("./config/env");
// Load environment variables
loadEnv();

const express = require('express');
const cors = require('cors');
const setupMiddlewares = require("./middlewares");
const fileRoutes = require('./routes/fileRoutes');

// Create Express app
const app = express();

// Setup middlewares
setupMiddlewares(app);

// Enable CORS
app.use(cors())

// Routes
app.use('/files', fileRoutes);

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
