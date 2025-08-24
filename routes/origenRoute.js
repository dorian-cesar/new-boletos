const express = require("express");
const router = express.Router();
const cityController = require("../controllers/origenController");

// Obtener todas las ciudades de origen y sus destinos
router.get("/cities", cityController.getCities);

module.exports = router;
