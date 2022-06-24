const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
  type:{
    type:String,
    default:"event",
    enum:["event","task"]
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  tag:
    {
      type: String,
    },

  description: {
    type: String,
  },  
  start: {
    type: Date,
    default: Date.now(),
  },
  end: {
    type: Date,
    default: Date.now(),
  },
  
  notes: {
    type: String,
  },
  user:{
      type: Schema.Types.ObjectId,
      ref: "User"
  }
});

module.exports = mongoose.model("Calendar",CalendarSchema);