const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authenticateUser = async (req,res,next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user)
        {
            return res.status(401).json({ message: 'Authentication required' });
        }
        req.user=user;
        next();
    }catch(err)
    {
        res.status(401).json({ message: 'Invalid token' });
    }
};
module.exports = authenticateUser;