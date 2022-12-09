const router = require('express').Router()
const asyncHandler = require('express-async-handler')
const Pin = require('../models/Pin')
const {protected} = require('../middlewares/authMiddleware')



//GEt Request for All Pins
router.get('/pins', asyncHandler(async(req, res)=>{
    const pins = await Pin.find().populate('user')
    if(pins){
        res.json(pins)
    }else{
        res.status(400)
        throw new Error("No Pins found")
    }
}))


//GET Request for User Specific Pins
router.get('/mypins', protected, asyncHandler(async (req, res)=>{
    
    const pins = await Pin.find({user: req.user.id})
    if(pins){
        res.status(200).json(pins)
    }else{
        throw new Error("No Pins Available for now")
    }
}))


//POSt Request to create new pin
router.post('/createpin', protected,  asyncHandler(async (req, res)=>{
    const {title, desc, link, size, filename} = req.body;

    
    if(!title || !size || !filename){
        res.status(400)
        throw new Error("This field cannot be empty")
    }

    const newPin = new Pin({
        title,
        desc,
        link,
        size,
        filename,
        user: req.user
    })

    const pin = await newPin.save()

    if(pin){
        res.status(200).json(pin)
    }else{
        res.status(400)
        throw new Error("Pin Processing cannot go through")
    }
}))



module.exports = router