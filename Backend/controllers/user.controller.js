// const userModel = require("../models/user.model");
// // const userService = require("../services/user.service");
// const { validationResult } = require('express-validator');
// const blacklistTokenModel = require("../models/blacklistToken.model");

// module.exports.registerUser = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullname, email, password } = req.body;
//     const isUserAlreadyExist = await userModel.findOne({ email });

//     if (isUserAlreadyExist) {
//         return res.status(400).json({ error: 'User with this email already exists' });
//     }

//     const hashedPassword = await userModel.hashPassword(password);

//     const user = await userModel.createUser({
//         fullname: {
//             firstname: fullname.firstname,
//             lastname: fullname.lastname
//         },
//         email,
//         password: hashedPassword
//     });
//     const token = user.generateAuthToken();
//     res.status(201).json({ user, token });
// }

// module.exports.loginUser = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email }).select('+password');
//     if (!user) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//     }
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//     }
//     const token = user.generateAuthToken();
//     res.cookie('token', token);



//     res.status(200).json({ user, token });

// }

// module.exports.getUserProfile = async (req, res, next) => {
//     res.status(200).json({ user: req.user });
// }

// module.exports.logoutUser = async (req, res, next) => {
//     res.clearCookie('token');
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
//     await blacklistTokenModel.create({ token });

//     res.status(200).json({ message: 'Logged out successfully' });
// }



const userModel = require("../models/user.model");
const { validationResult } = require('express-validator');
const blacklistTokenModel = require("../models/blacklistToken.model");


// ✅ REGISTER USER
module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return first error message for better client feedback
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { fullname, email, password } = req.body;

        // 🔍 Safety check
        if (!fullname || !fullname.firstname) {
            return res.status(400).json({ error: "Firstname is required" });
        }

        // 🔍 Check existing user
        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // 🔐 Hash password
        const hashedPassword = await userModel.hashPassword(password);

        // ✅ CREATE USER
        const user = await userModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname || ''
            },
            email,
            password: hashedPassword
        });

        // 🔐 Generate token
        const token = user.generateAuthToken();

        res.status(201).json({ user, token });

    } catch (err) {
        console.log("REGISTER ERROR:", err);
        res.status(500).json({ error: err.message || 'Registration failed' });
    }
};


// ✅ LOGIN USER
module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);
        res.status(200).json({ user, token });

    } catch (err) {
        console.log("LOGIN ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};


// ✅ GET PROFILE
module.exports.getUserProfile = async (req, res) => {
    res.status(200).json({ user: req.user });
};


// ✅ LOGOUT USER
module.exports.logoutUser = async (req, res) => {
    try {
        // ⚠️ Get token BEFORE clearing cookie
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blacklistTokenModel.create({ token });
        }

        res.clearCookie('token');

        res.status(200).json({ message: 'Logged out successfully' });

    } catch (err) {
        console.log("LOGOUT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
