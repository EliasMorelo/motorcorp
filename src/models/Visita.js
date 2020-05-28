const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitaSchema = new Schema({
  plate: {type: String, require: true},
  visit: { type: String, require: true },
  description: { type: String, require: true },
  date: { type: String, require: true }
});

module.exports = mongoose.model("Visita", visitaSchema);