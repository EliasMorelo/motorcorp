const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {type: String, require: true},
  plate: { type: String, require: true },
  make: { type: String, require: true },
  model: { type: String, require: true },
  vin: { type: String, require: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cliente", customerSchema);