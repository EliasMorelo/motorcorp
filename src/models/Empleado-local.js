const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserLocalSchema = new Schema({
  name: {type: String, require: true},
  email: { type: String, require: true },
  password: { type: String, require: true },
  created_at: { type: Date, default: Date.now },
});

UserLocalSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

UserLocalSchema.methods.decryptPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("UserLocal", UserLocalSchema);
