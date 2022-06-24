const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  times:[
    {
        startTime: {
            type: Date,
        },
        endTime: {
            type: Date
        },
        free: {
            type: Boolean,
            default:true
        },
        scheduledUser:{
            type: Schema.Types.ObjectId,
            ref: "User",
            default:undefined
        },
        notes: {
            type:String
        }

    }
  ]
});
module.exports = mongoose.model("Schedule", ScheduleSchema);
