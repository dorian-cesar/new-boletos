const express = require("express");
const router = express.Router();
const templateController = require("../controllers/routeBlockTemplateController");

// POST /api/templates
router.post("/", templateController.createTemplateFromBlock);

// GET /api/templates


module.exports = router;
