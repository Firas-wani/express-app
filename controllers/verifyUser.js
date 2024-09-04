const jwt =require("jsonwebtoken");
const {messageHandler}=require("../utils/utils");
const {config}=require("dotenv");
config("/.env");

const verifyUser =(req,res)=>{
    try {
        const secretKey =process.env.SECRET_KEY;
        const {token}=req.cookies;
        jwt.verify(token,secretKey,(error,decode)=>{
            if(error){
                return messageHandler(res,400,"Not Verified");
            }else{
                res.json({
                    message:"token Verified",
                    decode
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports=verifyUser