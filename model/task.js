const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Too short, min 3 character'], // to show message if error input
        maxlength: [50, 'Too length, max 50 character']
    },
    date: {
        type: Date
    },
    note: {
        type: String,
        maxlength: 500
    },
    priority: {
        type: String,
        enum: ['none', 'low', 'medium', 'high'],
        default: 'none'
    },
    status: {
        type: Boolean,
        default: false
    },
    user: { //in tasks collection appear userID owner of task on last field
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
})
const Task = mongoose.model('Task', taskSchema)
module.exports = Task
