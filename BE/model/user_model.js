var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  email:  {type: String, required: true, unique: true },
  psw:  {type: String, required: true },
  name:  {type: String, required: true },
  phone:  {type: String, required: true }
});

module.exports = mongoose.model("Users", usersSchema);
