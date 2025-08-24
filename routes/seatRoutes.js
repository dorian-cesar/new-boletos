const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

router.post("/reserve", seatController.reserveSeat);
router.post("/confirm", seatController.confirmSeat);
router.post("/release", seatController.releaseSeat);

module.exports = router;
