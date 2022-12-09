const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,        
        required: true,
        default: 18
    },
    avatar:{
        type: String,        
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    }
},{timestamps: true })



//encrypt User Password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

//decrypt User Password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};


module.exports = mongoose.model('User', userSchema)