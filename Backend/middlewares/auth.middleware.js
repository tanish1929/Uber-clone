const userModel = require('../models/user.model');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

// Middleware function to authenticate user using JWT token
// This function checks for the presence of a token in the request cookies or headers
// It verifies the token and retrieves the user information from the database
// If the token is valid, it attaches the user information to the request object and calls the next middleware
// If the token is invalid or missing, it returns a 401 Unauthorized response




module.exports.authUser = async (req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'unauthorized'});
    }
    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted){
        return res.status(401).json({error: 'unauthorized'});
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)

        req.user = user;
        return next();
        } 
    catch (err) {
        return res.status(401).json({error: 'unauthorized'});
    }
}

module.exports.authCaptain = async (req,res,next)=>{
    const captainModel = require('../models/captain.model');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'unauthorized'});
    }
    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted){
        return res.status(401).json({error: 'unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    } catch (err) {
        return res.status(401).json({error: 'unauthorized'});
    }
}
