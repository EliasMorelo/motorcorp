const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    provider: String,
    provider_id : {type: String, unique: true},
    photo: String,
    email: String,
    crated_at: {type: Date, Default: Date.now}
});


module.exports =  mongoose.model('User', UserSchema)
