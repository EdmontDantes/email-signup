const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true, lowercase: true },
    name: {type: String, required: true, lowercase: true },
    email: {type: String, unique: true, required: true, lowercase: true},
    address: {
            street: {type: String, lowercase: true},
            city: {type: String, lowercase: true},
            state: {type: String, lowercase: true}
    },
    password: { type: String, required: true, min: 3 }
});

module.exports = mongoose.model('user', UserSchema);