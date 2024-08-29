const mongoose = require('mongoose');

// Replace <yourusername> and <password> with your username and actual password for the mongodb atlas cluster
mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/?retryWrites=true&w=majority&appName=FSG5')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));
const app = express();
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {type: String, require: true, unique: true},
    description: {type: String},
    profilePic: {type: String},
    createAt: {type: Date, default: Date.now}
});

const user = mongoose.model('user',userSchema);
module.exports = user;