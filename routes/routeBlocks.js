const express = require('express');
const router = express.Router();
const controller = require('../controllers/routeBlockController');

// Crear bloque
router.post('/', controller.createRouteBlock);


module.exports = router;
