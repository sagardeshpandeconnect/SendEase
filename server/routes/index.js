const realEstateRoute = require("./realEstateRoute");

const setupRoutes = (app) => {
    app.use("/", realEstateRoute);
  };
  
  module.exports = setupRoutes;
