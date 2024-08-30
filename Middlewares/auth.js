const jwt =require("jsonwebtoken");
const {config} = require ('dotenv');
config("/.env");
const {messageHandler}=require("../utils/utils")

const secretKey=process.env.SECRET_KEY;

const isAuthenticated =(req,res,next)=>{
    try {
        const {token}=req.cookies;

        jwt.verify(token,secretKey,(error,decode)=>{
            if(error){
                messageHandler(res,401,"Unauthorised")
            }else{
                console.log(decode)
                req.user=decode._id;
                return next();
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}


module.exports=isAuthenticated;