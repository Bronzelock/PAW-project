const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    catch (error) {
        console.error('registeration error:', error);
        return res.status(500).json({error: 'Server error during registeration'});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: 'Password and/or email are missing'});
        }
        const existingUser = await User.findOne({email})
        if (existingUser) {
            const isMatch = await bcrypt.compare(password, existingUser.passwordHash)
            if (isMatch) {
                const token = jwt.sign(
                    { userId: existingUser._id }, 
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                return res.status(200).json({message: 'Login successfull', token: token});
            }
            else {
                return res.status(401).json({error: 'Invalid email or password!'});
            }
        } else {
            return res.status(401).json({error: 'Invalid email or password!'});
        }
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({error: 'Server error during login'});
    }
};
module.exports = {register, login};