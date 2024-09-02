const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/?retryWrites=true&w=majority&appName=FSG5')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log(error.message));

// Define Thread schema and model
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

// Start server
app.listen(3000, () => {
    console.log('http://localhost:3000/');
});
