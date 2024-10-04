const express = require('express');
const connectDb = require("./utils/connectdb");
const cookie =require("cookie-parser")

const bodyParser = require('body-parser');
const cors =require("cors")
const { handleSignUp , handleLogin, getUserDetails , editUser, deleteUser} = require('./controllers/userController');
const isAuthenticated = require('./Middlewares/auth');
const multmid = require("./Middlewares/multer");
const {config} = require ('dotenv');
// const { get } = require('mongoose'); not needed
config("/.env")
const verifyUser = require("./controllers/verifyUser");
const {handleProductCreation, getProducts, handleAddToCart, deleteProduct} = require('./controllers/productController');
const server = express();  
const port = process.env.PORT;
server.use(express.json())
server.use(bodyParser.json())
server.use(cors({
    origin:
"http://localhost:3000",
credentials:true

}))
server.use(cookie())


// Api routes for User

server.post("/user/signup", handleSignUp)
server.post("/user/login" , handleLogin )


// server.post("/user/forgot-password", handleForgotPassword )
// server.post("/user/resetpassword/:token", resetPassword )


server.post("/user/product",isAuthenticated,  multmid, handleProductCreation)

server.get("/user/getproducts", getProducts)

server.post("/user/cart", handleAddToCart)

server.delete("/product/delete/:id", deleteProduct);


server.get("/token/verify", verifyUser)
// server.get("/token/verify", verifyUser)
//Authenticated Routes for User
server.get("/user/userdetails",isAuthenticated, getUserDetails)
server.put("/user/edit",isAuthenticated, editUser)
server.delete("/user/delete",isAuthenticated, deleteUser)



server.listen(port, ()=>{
    console.log(`the server is running on ${port}`);
    })
    
    connectDb()