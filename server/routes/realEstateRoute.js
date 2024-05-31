const express = require("express");

const {getRealEstateData} = require("../controllers/RealEstateController")

const router = express.Router();

router.get("/", getRealEstateData);

module.exports = router;