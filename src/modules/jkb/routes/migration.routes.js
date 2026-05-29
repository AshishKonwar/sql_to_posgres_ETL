const express = require("express");

const router = express.Router();

const {
    migrateDatabase
} = require("../controllers/migration.controller");

router.post(
    "/migrate",
    migrateDatabase
);

module.exports = router;