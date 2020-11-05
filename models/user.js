const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        min: 6,
        max: 255,
        required: true
    },
    email:{
        type: String,
        min: 6,
        max: 1024,
        required: true,
        unique: true
    },
    password:{
        type: String,
        min: 6,
        max: 255,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema);
