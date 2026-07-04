const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoute');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Vault server is running correctly!' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Succesfully connected to mongoDB daatabase');
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Connection error with mongoDB:', error.message);
    });