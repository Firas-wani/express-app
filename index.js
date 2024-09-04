const express = require('express');
const connectDb = require("./utils/connectdb");
const cookie =require("cookie-parser")

const bodyParser = require('body-parser');
const cors =require("cors")
const isAuthenticated =require("./Middlewares/auth")
const { handleSignUp , handleLogin, getUserDetails, messenger, editUser, deleteUser } = require('./controllers/userController');
const {config} = require ('dotenv');
const verifyUser = require('./controllers/verifyUser');
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
server.get("/token/verify",verifyUser)


//Authenticated Routes for User

server.get("/user/details",isAuthenticated,getUserDetails)
server.put("/user/edit",isAuthenticated,editUser)
server.delete("/user/delete",isAuthenticated,deleteUser)



server.listen(port, ()=>{
    console.log(`the server is running on ${port}`);
    })
    
    connectDb()