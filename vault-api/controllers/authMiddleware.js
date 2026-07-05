const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authField = req.headers['authorization'];
    if (!authField || !authField.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unauthorized access'});
    }
    try {
        const jwtToken = authField.split(' ')[1];
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Not authorized, token failed'})
    }
};

module.exports = {verifyToken};