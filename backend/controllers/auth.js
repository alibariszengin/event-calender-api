const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers.js");
const { validateUserInput, comparePassword} = require("../helpers/input/inputHelpers.js");
//const { htmlEmailTemplate} = require("../helpers/authorization/emailHelpers.js");
//const sendEmail = require("../helpers/libraries/sendEmail");

const register =asyncErrorWrapper(async(req, res ,next) => {
    // POST DATA
    
    const {name, email, password } = req.body;
    // async,await 
   
    const user = await User.create({
        ...req.body
     
    });
    sendJwtToClient(user, res);
    
});

const login = asyncErrorWrapper(async(req, res ,next) => {

    const {email, password} = req.body;
    console.log(email,password);


    if(!validateUserInput(email,password)){
        return next(new CustomError("Please check your inputs",400));
    }

    const user= await User.findOne({email}).select("+password");
    if(!user){
        return next( new CustomError("Please check your email",400))
    }
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please check your credentials",400));
    }


    sendJwtToClient(user, res);
});






module.exports = {
    register,
    login


}