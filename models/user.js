const mongoose = require("mongoose");

//Define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    pfp: {
        type: String
    },
    status:{
        type: String,
    },
    description:{
        type: String
    }
})

// Create and export the User model based on the schema
module.exports = mongoose.model("Users", userSchema);

