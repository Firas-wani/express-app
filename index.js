const express = require('express');
const connectDb = require("./utils/connectdb");
const cookie =require("cookie-parser")

const bodyParser = require('body-parser');
const cors =require("cors")
const isAuthenticated =require("./Middlewares/auth")
const { handleSignUp , handleLogin, getUserDetails } = require('./controllers/userController');
const {config} = require ('dotenv');
config("/.env")

const server = express();  
const port = process.env.PORT;
server.use(express.json())
server.use(bodyParser.json())
server.use(cors())
server.use(cookie())


// Api routes for User

server.post("/user/signup", handleSignUp)
server.post("/user/login" , handleLogin )


//Authenticated Routes for User

server.get("/user/details",isAuthenticated,getUserDetails)



server.listen(port, ()=>{
    console.log(`the server is running on ${port}`);
    })
    
    connectDb()