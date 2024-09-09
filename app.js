const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { User, Thread, Reply } = require('./model');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/database?retryWrites=true&w=majority&appName=FSG5', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', async (req, res) => {
    try {
        const threads = await Thread.find().populate('createdBy');
        res.render('index', { threads, userId: req.session.userId });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            req.session.user = user;
            res.redirect('/');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/post', isAuthenticated, (req, res) => {
    res.render('thread');
});

app.post('/post', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newThread = new Thread({
            title,
            content,
            createdBy: req.session.userId
        });

        await newThread.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.get('/thread/:id', async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id)
            .populate('createdBy')
            .populate({
                path: 'replies',
                populate: [
                    {
                        path: 'createdBy',
                        model: 'User'
                    },
                    {
                        path: 'parentReply',
                        populate: {
                            path: 'createdBy',
                            model: 'User'
                        }
                    },
                    {
                        path: 'replies',
                        populate: [
                            {
                                path: 'createdBy',
                                model: 'User'
                            },
                            {
                                path: 'parentReply',
                                populate: {
                                    path: 'createdBy',
                                    model: 'User'
                                }
                            }
                        ]
                    }
                ]
            });

        res.render('latest', { thread });
    } catch (error) {
        console.error(error); 
        console.log(parentReplyId);
        res.status(500).send('Server Error');
    }
});



app.post('/reply/:id', isAuthenticated, async (req, res) => {
    const { content, parentReplyId } = req.body;
    try {
        const newReply = new Reply({
            content,
            createdBy: req.session.userId,
            thread: req.params.id,
            parentReply: parentReplyId || null
        });

        await newReply.save();

        if (parentReplyId) {
            await Reply.findByIdAndUpdate(parentReplyId, { $push: { replies: newReply._id } });
        } else {
            await Thread.findByIdAndUpdate(req.params.id, { $push: { replies: newReply._id } });
        }

        res.redirect(`/thread/${req.params.id}`);
    } catch (error) {
        console.error(error); 
        res.status(500).send('Server Error');
    }
});


app.post('/reply-to-reply/:id', isAuthenticated, async (req, res) => {
    const { content } = req.body;
    try {
        const parentReply = await Reply.findById(req.params.id);
        const newReply = new Reply({
            content,
            createdBy: req.session.userId,
            thread: parentReply.thread,
            parentReply: parentReply._id
        });

        await newReply.save();
        await Reply.findByIdAndUpdate(req.params.id, { $push: { replies: newReply._id } });
        res.redirect(`/thread/${parentReply.thread}`);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});
//get controller functions from controllers index
const { login, getLogin, getProfile, getProfileEditor, editProfile, editPfp, getAdminUI, lockUser, unlockUser} = require("./controllers/index");

//Middlewares
const handleFileUploadError = require("./middlewares/upload");
const isAdminCheck = require("./middlewares/isAdmin");

app.get("/", getLogin);

app.get("/profile", getProfile);

app.post("/login", login);

app.get('/profile_editor', getProfileEditor); 

app.post('/profile/edit', editProfile);

app.post('/profilePic-edit', editPfp); 

app.get('/adminUI', isAdminCheck, getAdminUI);

app.post('/user/:id/lock', lockUser);

app.post('/user/:id/unlock', unlockUser);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

