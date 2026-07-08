require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const VaultModel = require('./models/VaultModel');
const User = require('./models/User');

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb.');

        const testEmail = 'testowy@test.com';
        const existingUser = await User.findOne({ email: testEmail });
        
        let userId;
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('TestoweHaslo123', salt);
            
            const newUser = new User({ email: testEmail, passwordHash });
            const savedUser = await newUser.save();
            userId = savedUser._id;
            console.log(`Test user created ${testEmail}`);
        } else {
            userId = existingUser._id;
            console.log(`User ${testEmail} already exists.`);
        }

        const sampleModel = new VaultModel({
            title: 'Testowy Model Inicjalizacyjny',
            description: 'Model wygenerowany przez skrypt seed.js',
            fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.stl',
            cloudinaryId: 'models/sample.stl',
            userId: userId,
            status: 'analyzed',
            volume: 15.5,
            dimensions: '10x10x10'
        });

        await sampleModel.save();
        console.log('Test model added to the database.');

        console.log('Initialization success.');
        process.exit(0);
    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1);
    }
};

seedDatabase();