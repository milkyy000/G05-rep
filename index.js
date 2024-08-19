const mongoose = require('mongoose');

// Replace <yourusername> and <password> with your username and actual password for the mongodb atlas cluster
mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/?retryWrites=true&w=majority&appName=FSG5')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));