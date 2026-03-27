// Service function to register a new user
// This function takes user details as input, validates them, and creates a new user in the database
// It throws an error if any required field is missing or if the email is already in use
// The function returns the created user object


const userModel = require('../models/user.model');


module.exports.registerUser = async({
    firstname,lastname,email,password
}) =>{
    if(  !firstname  || !email ||!password  ){
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })
    return user;
}