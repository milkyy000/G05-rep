const mongoose = require('mongoose');
const app = express();
const express = require('express');
mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/?retryWrites=true&w=majority&appName=FSG5')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));
app.set('view engine', 'ejs');
const Schema = mongoose.Schema;
const profileSchema = new Schema({
    userName: {type: String, require: true, unique: true},
    description: {type: String},
    profilePic: {type: String},
    createAt: {type: Date, default: Date.now}
});
const userSchema = new Schema({
    userName: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true, unique: true}
});
const Profile = mongoose.model('Profile',profileSchema);
const User = mongoose.model('User',userSchema);
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/profile',(req,res)=>{
const profile = new Profile(req.body);
Profile.save()
.catch(error => res.send(error));
});

app.post('/profile/:id/update',(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['userName','description','profilePic','createAt'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if (!isValidOperation){
        return res.send({ error: 'Invalid updates!'});
    }
    Profile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators,
    })
    .then(profile =>{
        if (!profile){
            return res.send('Not found any profile matching ID!');
        }
        res.redirect('/profile');
    })
    .catch(error=> res.send(error));
});

app.listen(3000, () => {
    console.log('Server is up port 3000')
});