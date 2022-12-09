const router = require('express').Router();
const asyncHandler = require('express-async-handler')
const {OAuth2Client} = require('google-auth-library')
const User = require('../models/User')
const {generateToken} = require('../utils/jwt')
const {protected} = require('../middlewares/authMiddleware')



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)



/* GEt Request for currentUser */
router.get('/auth/user/:id', protected, asyncHandler(
    async(req, res)=>{
        const id = req.params.id;
        const user = await User.findById({_id: id})
        if(user){
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        }else{
            throw new Error('User request failed')
        }
    }
))

//Create New User Route {POST Request}
router.post('/auth', asyncHandler(
    async (req, res)=>{
        const {username, email, age, password} = req.body;
    
        //Validate empty input fields
        if(!username || !email || !password){
            throw new Error("Please enter field")
        }
        
        
        //Check if user exists
        const userExist = await User.findOne({email})
        if(userExist){
            res.status(400)
            throw new Error("User Already Exist");
        }
    
        //Create new User
        const newUser = new User({username, email, password, age})
        const user = await newUser.save()
    
        if(user){
            res.status(200).json({
                _id: user._id, 
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username, 
                email: user.email, 
                age: user.age,
                isAdmin: user.isAdmin,
                avatar: user.avatar || '',
                token: generateToken(user._id)
            })
        }
        res.status(400); 
        throw new Error("An Error Occurred");
    }
))


//Login User Route (POST Request)
router.post('/login', asyncHandler(
    async(req, res)=>{
        const {email, username, password} = req.body

        //Check if user exists
        const user = await User.findOne({email})
        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                age: user.age,
                isAdmin: user.isAdmin,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error("Invalid Email or Password")
        }
    }
))


/* POST Request Google login */
router.post('/google-login', asyncHandler(async (req, res)=>{
    const {token} = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const {name, email, picture} = ticket.getPayload()
    const newUser = new User({
        username: name,
        email: email,
        avatar: picture        
    })

    const user = await newUser.save()
    if(user){
        res.status(201).json({name, email, picture, token})
    }else{
        throw new Error("User Has not been validated")
    }
}))



/* PUT Request to Update User Profile */
router.put('/update/:id', protected, asyncHandler(async (req, res)=>{
    const {firstname, lastname, username, password, avatar} = req.body;
    const updatedUser = await User.findByIdAndUpdate({_id: req.params.id})

    //Checking if password Exists
    if(password === ""){
        updatedUser.firstname = firstname;
        updatedUser.lastname = lastname;
        updatedUser.username = username;
        updatedUser.avatar = updatedUser.avatar
        updatedUser.isAdmin = updatedUser.isAdmin
        
        const user = await updatedUser.save()
        if(user){
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error("Sorry profile failed to update")
        }
    }else{
        updatedUser.firstname = firstname;
        updatedUser.lastname = lastname;
        updatedUser.username = username;
        updatedUser.password = password;
        updatedUser.avatar = updatedUser.avatar;
        updatedUser.isAdmin = updatedUser.isAdmin;
        
        const user = await updatedUser.save()
        if(user){
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error("Sorry profile failed to update")
        }
    }



    //Checking if avatar filename Exists
    if(!avatar){
        updatedUser.firstname = firstname;
        updatedUser.lastname = lastname;
        updatedUser.username = username;
        updatedUser.isAdmin = updatedUser.isAdmin;
        
        const user = await updatedUser.save()
        if(user){
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error("Sorry profile failed to update")
        }
    }else{
        updatedUser.firstname = firstname;
        updatedUser.lastname = lastname;
        updatedUser.username = username;
        updatedUser.avatar = avatar;
        updatedUser.isAdmin = updatedUser.isAdmin;
        
        const user = await updatedUser.save()
        if(user){
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error("Sorry profile failed to update")
        }
    }
  

    
}))


module.exports = router;