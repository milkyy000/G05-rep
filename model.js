const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String},
    password: {type: String},
    mouse: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Mouse'
    }]
});

const mouseSchema = new mongoose.Schema({
    model: {type: String},
    image: {type: String}
});

const User = mongoose.model('User', userSchema);
const Mouse = mongoose.model('Mouse', mouseSchema);

module.exports = {User, Mouse}
