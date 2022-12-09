const mongoose = require('mongoose')


const pinSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    desc:{
        type: String
    },
    size:{
        type: String,
        required: true
    },
    link:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    filename:{
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Pin', pinSchema)