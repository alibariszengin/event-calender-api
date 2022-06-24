const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers.js");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers.js");
const { htmlEmailTemplate } = require("../helpers/authorization/emailHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req, res, next) => {
  const { password, passwordCheck } = req.body;

  // if (password !== passwordCheck) {
  //   return next(new CustomError("Password values are not the same", 400));
  // }
  console.log(req.body)
  const user = await User.create({
    ...req.body,
  });
  sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  //const {email, password} = req.body;
  //console.log(email,password);
  const { email, password } = req.body;
  console.log(email, password);

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("Please check your email", 400));
  }

  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }

  sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

const getUser = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// Forgot Password
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;

  console.log(resetEmail);
  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is no user with that email", 400));
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();

  const resetPasswordUrl = `http://localhost:3000/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = htmlEmailTemplate(resetPasswordUrl);
  
  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your Password",
      html: emailTemplate,
    });
    console.log("7");
    return res.status(200).json({
      success: true,
      message: "Token Sent To Your Email",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError("Email Could Not Be Sent", 500));
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;

  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token", 400));
  }

  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid Token or Session Expired", 404));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  return res.status(200).json({
    success: true,
    message: " Reset Password Process Successfull",
  });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;
  console.log(editInformation.password);
  if (editInformation.password || editInformation.email) {
    return next(
      new CustomError(
        "You can't change your password or email information",
        403
      )
    );
  }
  console.log("edit details");
  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  editDetails,
};
