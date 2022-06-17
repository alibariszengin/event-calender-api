const express = require("express");
const {
  register,
  login,
  getUser,
  logout,
  forgotPassword,
  resetPassword,
  editDetails,
} = require("../controllers/auth.js");
const {
  swagger_profile,
  swagger_logout,
  swagger_register,
  swagger_login,
  swagger_forgot_password,
  swagger_reset_password,
  swagger_edit,
} = require("../api_documentation/swagger-declarations");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const router = express.Router();

router.get("/profile", swagger_profile, getAccessToRoute, getUser);

router.get("/logout", swagger_logout, getAccessToRoute, logout);
router.post("/register", swagger_register, register);
router.post("/login", swagger_login, login);

router.post("/forgotpassword", swagger_forgot_password, forgotPassword);
router.put("/resetpassword", swagger_reset_password, resetPassword);

router.put("/edit", swagger_edit, getAccessToRoute, editDetails);

module.exports = router;
