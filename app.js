const mongoose = require('mongoose');
const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const {User, Mouse} = require('./model');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const db = process.env.DATABASE;

mongoose.connect(db)
.then(() =>console.log('Connected successfully to database'))
.catch(error => console.log(error));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET, // Replace with a strong secret key
    resave: false,             // Don't save session if unmodified
    saveUninitialized: false,  // Don't create session until something is stored
    cookie: { maxAge: 600000 }  // Session expires after 1 minute (adjust as needed)
}));

app.get('/', async (req, res) =>{
    try{
    res.render('index');
    } catch (error){
        console.log(error);
    }
});

app.post('/create/user', async(req,res) =>{

    try{
    const {name} = req.body;
    const newUser = new User ({
        name
    });
    await newUser.save();

    console.log('Created user successfully' + newUser);
    res.redirect('/');
} catch (error){
    console.log(error);
}
});

app.get('/search', async(req,res) =>{
    const name = req.query.query;
    try{
        const foundUser = await User.find({ 
            name
        })
        res.render('/', foundUser);
    } catch(error){
        console.log(error);
    }
});



app.listen(process.env.PORT, ()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`)
});

