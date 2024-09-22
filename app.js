const mongoose = require('mongoose');
const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const {User, Mouse} = require('./model');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');//For deleting files in upload directory

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
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

app.use(session({
    secret: process.env.SECRET, // Replace with a strong secret key
    resave: false,             // Don't save session if unmodified
    saveUninitialized: false,  // Don't create session until something is stored
    cookie: { maxAge: 360000 }  // Session expires after 1 hour
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
    const {name, password} = req.body;
    const newUser = new User ({
        name,
        password
    });
    await newUser.save();

    console.log('Created user successfully' + newUser);
    res.redirect('/');
} catch (error){
    console.log(error);
}
});

app.post('/login', async (req,res) =>{
    try{
    const {name, password, remember }= req.body;
    const foundUser = await User.findOne({name: name})
    if(name){
        if(foundUser.password === password){
        req.session.user = foundUser;
            if (remember) {
                res.cookie('name', foundUser.name, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });//1 month cookie
            } else {
                res.cookie('name', foundUser.name, { maxAge: null, httpOnly: true });
            }
        res.redirect('/search');
        } else{
            res.send('Incorrect password');
        }
    } else {
        res.send('No user found');
    }
}catch(error){
    res.send(error);
}
})


function isAuthenticated(req,res,next){
    if(req.session.user || req.cookies.name){
        return next();
    } else {
        res.send("Please log in");
    }
}
app.get('/search',isAuthenticated, async(req,res) =>{
    const name = req.query.query || req.cookies.name; // added req.cookies.name to check for user name stored in cookie
    console.log(req.cookies.name);
    const sessionUser = req.session.user || req.cookies.name;
    try{
        const foundUser = await User.find({ 
            name
        }).populate('mouse');
        res.render('search', {foundUser, sessionUser});
    } catch(error){
        console.log(error);
    }
});

//Multer
const multer = require('multer');
const { Buffer } = require('buffer');
//Storage in /uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
        // If the file format is allowed, accept the file
        return cb(null, true);
    }
    return cb(new Error('Invalid file type. Please choose jpeg/JPG/png'));
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 1 }
});
//Error handler
const uploadErrorHandler = (err, req, res, next) =>{
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            req.session.error = 'File too large. Max size 1MB'
            console.log("Upload error handler error: " + err);
            return res.redirect('/');
        }
    }
    if (err.message === "Invalid file type. Please choose jpeg/JPG/png") {
        req.session.error = "Invalid file type. Please choose jpeg/JPG/png";
        console.log("Upload error handler error: " + err.message);
        return res.redirect('/');
    }
    next();
};

app.post('/addMouse/:id', upload.single('img'), uploadErrorHandler, async(req,res)=>{
    try{
    const userId = req.params.id;
    const model = req.body.model;
    const img = req.file.filename;
    console.log(img);
    if(req.file){
        var imgURL = `/uploads/${img}`;
    } else {
        var imgURL = null;
    }
    
    const newMouse = new Mouse({
        model,
        image: imgURL
    })

    await newMouse.save();
    
    await User.findByIdAndUpdate(userId, { $push:{ mouse: newMouse._id}});
    res.redirect('/');
}catch(error){
    console.log(error);
}
});

app.post('/delete/:mouseId/:userId', async(req,res) => {
    try{
    const {mouseId, userId} = req.params;
    const mouse = await Mouse.findById(mouseId);

    const imagePath = path.join(__dirname, mouse.image);
        // Delete the mouse image from /uploads
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting the image file:', err);
            }
        });

    await User.findByIdAndUpdate(userId, {
        $pull: {mouse: mouseId}
    }); //remove the mouse id from user's mouse array

    await Mouse.findByIdAndDelete(mouseId); //delete mouse in mouse document

    res.redirect('/');
    } catch(error){
        console.log(error)
    }
})



app.listen(process.env.PORT, ()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`)
});

