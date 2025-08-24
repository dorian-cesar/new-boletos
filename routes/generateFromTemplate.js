// routes/generateFromTemplate.js
const express = require("express");
const router = express.Router();
const generatedController = require("../controllers/routeBlockGeneratedController");

// 📌 Generar servicios a partir de una plantilla
router.post("/", generatedController.generateFromTemplate);

module.exports = router;
