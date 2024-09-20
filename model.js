const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String},
    mouse: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'mouseSchema'
    }]
});

const mouseSchema = new mongoose.Schema({
    model: {type: String},
    image: {tpye: String}
});

const User = mongoose.model('User', userSchema);
const Mouse = mongoose.model('mouse', mouseSchema);

module.exports = {User, Mouse}
