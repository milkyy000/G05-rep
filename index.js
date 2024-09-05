const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/database?retryWrites=true&w=majority&appName=FSG5')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log(error.message));

// Define Thread schema and model
const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    thread: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    }]
});
const User = mongoose.model('User',userSchema);

const threadSchema = new mongoose.Schema({
    threadTitle: {
        type: String,
        required: true,
        maxlength: 50
    },
    date: {
        type: Date,
        default: Date.now
    },
    postContent: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Thread = mongoose.model('Thread', threadSchema);

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/thread/new', (req, res) => {
    res.render('thread');
});

app.get('/login',(req,res)=>{
    res.render('login');
})



app.post('/thread', (req, res) => {
    const { title, content } = req.body;
    const newThread = new Thread({ threadTitle: title, postContent: content });
    newThread.save()
        .then(() => res.redirect('/latest'))
        .catch(error => res.send(error));
});

app.get('/latest', (req, res) => {
    Thread.find({})
        .then(threads => res.render('latest', { threads }))
        .catch(error => res.send(error));
});

app.get('/thread/:id', (req, res) => {
    const threadId = req.params.id;
    Thread.findById(threadId)
        .then(thread => {
            if (thread) {
                res.render('thethread', { thread });
            } else {
                res.status(404).send('Thread not found');
            }
        })
        .catch(error => res.status(500).send(error));
});
app.post('/Login', (req, res) => {
    const { username } = req.body; // Extract username from request body

    // Check if username exists
    if (!username) {
        return res.status(400).send('Username is required');
    }

    // Create a new User instance with the username
    const newUser = new User({ userName: username });

    newUser.save()
        .then(() => res.redirect('/latest'))
        .catch(error => res.status(500).send(`Error: ${error.message}`));
});

// Start server
app.listen(3000, () => {
    console.log('http://localhost:3000/');
});
