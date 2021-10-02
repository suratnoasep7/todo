const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username must be filled'],
        unique: [true, 'username already exist, must be unique'],
        minlength: [3, 'Too short, min 3 character'],
        validate: function(username){
            return /^\S*$/.test(username) //using regular expression
        }
    },
    email: {
        type: String,
        required: [true, 'email must be filled'],
        unique: [true, 'email already exist, must be unique'],
        validate: function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Too short, min 5 character'], // to show message if error input
    },
    date: {
        type: Date,
        default: Date.now
    },
    tasks: [{ //in users collection appear task on 2nd field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
})

const User = mongoose.model('User', userSchema)
userSchema.plugin(uniqueValidator)

module.exports = User
