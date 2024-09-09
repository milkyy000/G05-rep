const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./model'); 

mongoose.connect('mongodb+srv://BeNa:FSG5123-Admin@fsg5.myx06.mongodb.net/database?retryWrites=true&w=majority&appName=FSG5', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        const name = 'testuser4';
        const password = 'testpassword4'; 
        const photo = null;
        const status = "Locked user testing";
        const description= "grrr i got locked";
        const isLocked = false;
        const isAdmin= true;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            password: hashedPassword,
            photo,
            status,
            description,
            isLocked,
            isAdmin
        });

        await user.save();
        console.log('User created successfully');

        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error connecting to MongoDB', error);
    });
