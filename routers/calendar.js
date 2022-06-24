const express = require("express");
const { addItem, getAllItems, deleteAllItems } = require("../controllers/calendar.js");
const {
  swagger_calendar_add,
  swagger_calendar_get,
  swagger_calendar_edit,
} = require("../api_documentation/swagger-declarations");

const router = express.Router();
router.get("/", swagger_calendar_get, getAllItems);
router.get("/deleteAll", deleteAllItems);
router.post("/add", swagger_calendar_add, addItem);

router.put("/edit", swagger_calendar_edit, addItem);

module.exports = router;
