const User = require('../models/User');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: 'Password and/or email are missing'});
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'User with this email already exists'});
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User ({
            email,
            passwordHash
        });
        await newUser.save();

        return res.status(201).json({message: 'Registered successfully'})
    }
    catch (error){
        console.error('registeration error:', error);
    }
};
module.exports = {register};