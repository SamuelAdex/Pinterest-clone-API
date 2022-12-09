const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {notFound, errorHandler} = require('./middlewares/errors')

const app = express()


dotenv.config()

//MongoDB Connection
mongoose.connect('mongodb://localhost/pinterest',{    
    useUnifiedTopology: true,
})
.then(()=> console.log("Database Connected"))
.catch(err => console.log(`DB Error: ${err}`))


//All Necessary Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin:'*', 
    credentials:true,
}))
app.use(morgan("dev"))


//Testing server
app.get('/', (req, res)=>{
    res.send("Server Running Successfully On " + PORT)
})



//All Routes
const userRoute = require('./routes/user')
app.use('/api/user', userRoute)

const pinRoute = require('./routes/pin')
app.use('/api/pin', pinRoute)


//Error Middlewares
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Running on PORT: ${PORT}`)
})