const express = require("express");
const {getAccessToRoute} = require("../middlewares/authorization/auth.js");
const {
  getIntegration,
  redirectUser,
  syncCalendar,
  authorize,
  completeLogin,
  logout
} = require("../controllers/outlook.js");
const router = express.Router();

router.get("/", getIntegration);
router.get("/logout", logout);
router.get("/redirect", authorize);
router.get("/sync", syncCalendar);
router.get("/logincomplete" , completeLogin);
module.exports = router;
