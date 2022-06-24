const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntegrationSchema = new Schema({
  type:{
    type:String,
    default:"Outlook",
    enum:["Outlook","Google"]
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  mail:{
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please provide a valid email",
    ],
  }
});

module.exports = mongoose.model("Entegration",EntegrationSchema);