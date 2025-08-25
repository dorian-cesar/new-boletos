const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// GET /services?origin=Santiago&destination=Talca&date=2025-08-25
router.get("/", serviceController.getServicesByRouteAndDate);

module.exports = router;
