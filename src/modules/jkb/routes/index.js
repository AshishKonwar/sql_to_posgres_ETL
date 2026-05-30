const express = require("express");

const router = express.Router();

router.use(require("./migration.routes"));
router.use(require("./teaworkers.routes"));

module.exports = router;