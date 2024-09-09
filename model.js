const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin:  { type: Boolean, default: false},
    isLocked: { type: Boolean},
    status:   { type: String},
    description:{type: String},
    photo: { type: String, default: null}
});

const threadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply', default: null },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

const User = mongoose.model('User', userSchema);
const Thread = mongoose.model('Thread', threadSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports = { User, Thread, Reply };
