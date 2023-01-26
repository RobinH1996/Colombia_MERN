var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var dataSchema = new Schema({
  email: {type: String, required: true },
  name:  {type: String, required: true },
  loc:  {type: String, required: true },
  phone:  {type: String, required: true },
  fav: {
      type: Array,
      default: []
  }
});

module.exports = mongoose.model("Data", dataSchema);
