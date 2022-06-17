const CalendarItem = require("../models/Calendar");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

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
const getAllItems = asyncErrorWrapper(async (req, res, next) => {
  const newItem = await CalendarItem.find();
  return res.status(200).json({
    success: true,
    data: newItem,
  });
});

module.exports = {
  addItem,
  getAllItems,
  updateItem
};