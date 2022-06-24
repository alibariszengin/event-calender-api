const CalendarItem = require("../models/Calendar");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Entegration = require("../models/Entegration");
const User = require("../models/User");

const updateItem = asyncErrorWrapper(async(req, res, next)=>{
    const {body} = req;
    const item = await Calendar.findByIdAndUpdate(body.id, body,{
        new :true,
        runValidators:true
    });

    return res.status(200)
    .json({
        success:true,
        data : item
    });
})
const addItem = asyncErrorWrapper(async (req, res, next) => {
  const { body } = req;
  console.log(body);
  const newItem = await CalendarItem.create({ ...body });
  return res.status(200).json({
    success: true,
    data: newItem,
  });
});
const addOutlookItems = asyncErrorWrapper(async (email, body, res) => {
  const entegration = await Entegration.find({mail: email});
  const user = await User.findById(entegration.user)
  body.forEach(async(item) =>{
    const item_body = item;
    console.log(item_body)
    const start = item_body.Start.DateTime;
    const end = item_body.End.DateTime;
    const title = item_body.Subject;
    const item_info = {
      start, end, title, user
    };

    const calendar_item = await CalendarItem.create({...item_info});
    if(user.events){
      user.events.add(calendar_item);
    }
    else{
      user.events=[calendar_item];
    }

    
    await user.save();
  });
  return res.redirect("http://localhost:3000");
});
const getAllItems = asyncErrorWrapper(async (req, res, next) => {
  const newItem = await CalendarItem.find();
  return res.status(200).json({
    success: true,
    data: newItem,
  });
});

const deleteAllItems = asyncErrorWrapper(async(req, res, next) =>{
  await CalendarItem.deleteMany();
  return res.status(200).json({
    success: true,
    data: "deleted",
  });
})

module.exports = {
  addItem,
  getAllItems,
  updateItem,
  addOutlookItems,
  deleteAllItems
};