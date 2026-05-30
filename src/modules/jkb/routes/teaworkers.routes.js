const express = require("express");

const router = express.Router();

const {
    getWorkSummary, getDailyHazSummary
} = require("../controllers/teaworkers.controller");

router.get(
    "/tea-workers/daily-haz-summary",
    getDailyHazSummary
);

router.get("/tea-workers/work-summary", getWorkSummary);

module.exports = router;