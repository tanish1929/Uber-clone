const moongoose = require('mongoose');

const blacklistTokenSchema = new moongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // token will be removed after 1 hour
    }

})


module.exports = moongoose.model('BlacklistToken', blacklistTokenSchema);