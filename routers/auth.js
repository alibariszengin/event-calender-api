const express = require("express");
const { register, login} = require("../controllers/auth.js");
const { getAccessToRoute } = require("../middlewares/authorization/auth");

const router = express.Router();

router.post("/register", register); // api/register 
router.post("/login", login); // api/login 


module.exports = router;
