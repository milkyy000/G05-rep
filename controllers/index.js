const User = require("../models/user"); // Import the User model from user.js
//add more as needed
const path = require('path');
//Controller function for rendering the login page
exports.getLogin = async (req, res) => {
    const userId = req.session.userId;
    if (userId) {
        return res.redirect("/login")
    } else {
        return res.render("login", { message: "Yipee" });//testing error message- not important
    }
};

//Controller fucntion for handling user login with only the name
exports.login = async (req, res) => {
    //extracting name from request body. The ?. is for optimal chaining.
    const data = {
        username: req?.body?.username
    };
    //find user in the database base on the username in login
    const user = await User.findOne({ name: data.username });

    //if user is not found, render login page with error message
    if (!user) {
        return res.render("login", { message: "Wrong user name" });
    } else {
        // else set the session for the user and render profile
        // req.session.userId = user.id;
        req.session.user = user; // save all the user info to session
        // Setting a session cookie expiration time (1 hour in this case)
        if (req.session.user.isAdmin) {
            req.session.error = 'This guys an admin';
            req.session.adminStatus = 'Admin';
        }
        req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 1000);
        // console.log(user);
        return res.redirect("/profile")
    }
};

//Controller function to render profile with user's info
exports.getProfile = async (req, res) => {
    // console.log("req session: " + req.session.user);
    // console.log(user);
    let user = req.user;

    //taking req.session.error from other controllers( editProfile - !isValidOperation ) to display error
    const message = req.session.error || null;
    req.session.error = null; //reseting the session error to null for later use

    const adminStatus = req.session.adminStatus || null;
    req.session.adminStatus = null;

    if (!user) {
        user = req.session.user;
    }
    console.log("user id: " + req.session.user._id + 'Error message: ' + message + "Is admin ? : " + adminStatus);
    res.render("profile", { user, message, adminStatus });
};

//=============Profile editor=================//

exports.getProfileEditor = async (req, res) => {
    let user = req.user;
    const message = req.session.error || null;
    req.session.error = null;
    if (!user) {
        user = req.session.user;
    }
    res.render('profile_editor', { user, message });
};

//Sorry in advance for spaghetti code, i'll try to note down it's functionality
exports.editProfile = async (req, res) => {
    // const editData = {
    //     name: req.body.username,
    //     status: req.body.status,
    //     description: req.body.description
    // }; use req.body instead of editData in User.findByIdAndUpdate(req.session.user._id, editData, {
    // console.log(req);
    
    const updates = Object.keys(req.body);
    console.log("Updates: " + updates);
    console.log("Request body: " + req.body);
    const allowedUpdates = ['name', 'status', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        req.session.error = "Error while updating profile";
        return res.redirect('/profile');
    }

    //Check if the username is taken before saving new username
    const newName = req.body.name;
    if(newName === req.session.user.name){ //if the user havent changed anything in the username form and submit it will send them back to profile without changing anything
        res.redirect('/profile');
    }
    else {
        try {
            const usernameTaken = await User.findOne({name: newName});//returns null if the username isnt taken, returns a username else
            if (usernameTaken) { //if username is taken, redirect user to edit profile form with error message
                req.session.error = "Username already taken";
                res.redirect('/profile_editor');
            } 
            else { //Update user's info in the database
            User.findByIdAndUpdate(req.session.user._id, req.body, {
                new: true,
                runValidators: true,
            })
                .then(editedUser => {
                    if (!editedUser) {
                        req.session.error = "Did not find the matching user id";
                        return res.redirect('/profile');
                    }
                    req.session.user = editedUser;
                    res.redirect('/profile');
                })
                .catch(error =>{
                    req.session.error = 'Server error while updating profile';
                    res.redirect('/profile_editor');
                    console.log(error);
                });
            }
        } catch (error) {
            req.session.error = "Server error while checking for username";
            res.redirect('/profile');
        }
    }
};

//Edit pfp
const multer = require('multer');
const { Buffer } = require('buffer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));

        if (mimeType && extname) {
            // If the file format is allowed, accept the file
            return cb(null, true);
        }
        //Custom error message
        return cb(new Error('Invalid file type. Please choose jpeg/JPG/png'));
        // If the file format is not allowed, render the signup page with an error message
        // res.render("profile_editor", { message: "Check the file format and size below 5kb"});
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
});

//Error handler for profile posting file too large
const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            req.session.error = 'File too large. Max size 1MB'
            return res.redirect('/profile_editor');
        }
    }
    next();
};

exports.editPfp = [
    // Multer middleware to handle file upload and uploadErrorHandler for file size error
    upload.single('image'), uploadErrorHandler, async (req, res) => {
        try {
            // Log the file and other request data
            console.log('Trying to post edit pfp');
            // console.log(req.body);
            // const updates = Object.keys(req.file);
            // const allowedUpdates = ['photo'];
            // const isValidOperation = updates.every((update) => allowedUpdates.includes(updates));
            //Check for no files uploaded
            if (!req.file) {
                req.session.error = "Incorrect file format uploaded. Please only use JPEG/PNG/JPG for profile picture";
                return res.redirect('/profile_editor');
            };
            // Convert the file buffer to base64
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const editedUser = await User.findByIdAndUpdate(req.session.user._id, { photo: base64Image }, {
                new: true
            });
            if (!editedUser) {
                req.session.error = "Error with server. User id not found";
                return res.redirect('/profile')
            }
            console.log('Edited user:' + editedUser);
            req.session.user = editedUser;
            return res.redirect('/profile');
        } catch (error) {
            console.log(error);
        }
    }
];


//ADMIN controllers
//isAdmin check is in middlewares and implemented in routers


//Controller for admin UI
exports.getAdminUI = async (req, res) => {
    let user = req.user;
    //taking req.session.error from other controllers( editProfile - !isValidOperation ) to display error
    const message = req.session.error || null;
    req.session.error = null; //reseting the session error to null for later use
    const adminStatus = req.session.adminStatus || null;
    req.session.adminStatus = null;
    if (!user) {
        user = req.session.user;
    }
    console.log("user id: " + req.session.user._id + 'Error message: ' + message + "Is admin ? : " + adminStatus);
    try{
    let userArray = await User.find({}); //finds all the user in the database put into a 'userArray' array
    // console.log("User array" + userArray);
    res.render("adminUI", { user, message, adminStatus, userArray });
    } catch (error) {
        console.log(error);
    }
};

//Controller for LOCKING USERS
exports.lockUser = async (req,res) => {
    try{
    console.log('User id trying to lock: '+ req.params.id);
    const checkLocked = await User.findByIdAndUpdate(req.params.id, {isLocked: true}, {new: true});
    console.log(checkLocked);
    if(checkLocked.isLocked){
        console.log('User has been locked successfully');
        res.redirect("/adminUI");
    } else {
        console.log('User has been locked UNsuccessfully');
        res.redirect("/adminUI");
    }
} catch(error){
    console.log(error);
}
}
//Controller for UNLOCKING USERS
exports.unlockUser = async (req,res) => {
    try{
    console.log('User id trying to unlock: '+ req.params.id);
    const checkUnlocked = await User.findByIdAndUpdate(req.params.id, {isLocked: false}, {new: true});
    console.log(checkUnlocked);
    if(!checkUnlocked.isLocked){
        console.log('User has been unlocked successfully');
        res.redirect("/adminUI");
    } else {
        console.log('User has been unlocked UNsuccessfully');
        res.redirect("/adminUI");
    }
} catch(error){
    console.log(error);
}
}