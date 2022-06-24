const express = require("express");
const auth = require("./auth");
const calendar = require("./calendar");
const outlook = require("./outlook");
const router = express.Router();

router.use("/auth", auth);
router.use("/calendar", calendar);
router.use("/outlook", outlook);
module.exports = router;
