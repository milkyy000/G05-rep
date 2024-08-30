const User = require("../models/user"); // Import the User model from user.js
//add more as needed

//Controller function for rendering the login page
exports.getLogin = async (req, res) => {
    const userId = req.session.userId;
    if (userId) {
        return res.redirect("/login")
    } else {
        return res.render("login");
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
        req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 1000);
        console.log(user);
        return res.redirect("/profile")
    }
};

//Controller function to render profile with user's info
exports.getProfile = async (req, res) => {
    // console.log("req session: " + req.session.user);
    // console.log(user);
    let user = req.user;
    if (!user) {
        user = req.session.user;
    }
    console.log("user id: "+ user.id)
    res.render("profile", { user });
};