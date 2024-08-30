const mongoose = require('mongoose');
const express = require('express');
const app = express();
const dbUrl = process.env.DATABASE;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to the database');
  });
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {type: String, require: true, unique: true},
    description: {type: String},
    profilePic: {type: String},
    createAt: {type: Date, default: Date.now}
});

const user = mongoose.model('user',userSchema);
app.set ('view engine','ejs');
const test = document.getElementById('box1');
