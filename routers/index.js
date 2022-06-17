const express = require("express");
const auth = require("./auth");
const calendar = require("./calendar");

const router = express.Router();

router.use("/auth", auth);
router.use("/calendar", calendar);
module.exports = router;
