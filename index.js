const mongoose = require('mongoose');
const User = require("./models/user"); // Import the User model from user.js 

// Replace <yourusername> and <password> with your username and actual password for the mongodb atlas cluster
mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/Na_test_FSG5?retryWrites=true&w=majority&appName=FSG5')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));

// const newUser = new User({
//     name: "Na",
//     pfp: "neco-arc.png",
//     status: "Straight jorkin it",
//     description: "May thy jorketh' thee meat"
// });

// newUser.save()
// .then(user => {
//     console.log("User created: ", user);
//     mongoose.connection.close();
// })
// .catch(err => {
//     console.log("User not created", err);
//     mongoose.connection.close();
// });