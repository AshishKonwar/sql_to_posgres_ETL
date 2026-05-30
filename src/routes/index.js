const express = require("express");

const router = express.Router();

router.use("/jkb", require("../modules/jkb/routes"));

module.exports = router;