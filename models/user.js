const mongoose = require("mongoose");

//Define user schema
const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean
    },
    isLocked:{
        type: Boolean
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    status:{
        type: String,
    },
    description:{
        type: String
    },
    photo: {
        type: String
    }
})

// Create and export the User model based on the schema
module.exports = mongoose.model("Users", userSchema);

