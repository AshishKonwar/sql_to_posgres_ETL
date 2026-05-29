const express = require("express");

const router = express.Router();

const dailyHazController = require("../controllers/teaworkers.controller");

router.get(
    "/tea-workers/daily-haz-summary",
    dailyHazController.getDailyHazSummary
);

module.exports = router;