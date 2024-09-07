const jwt = require("jsonwebtoken");
const messageHandler = require("../utils/utils");
const {config, configDotenv} = require("dotenv");
config("/.env");


const verifyUser = async(req,res)=>{
    try {
        const secretKey = process.env.SECRET_KEY;
        const {token}= req.cookies;
        jwt.verify(token,secretKey,(error,decode)=>{
            if(error){
                return messageHandler(res,400,"Not Verified")
 }else{
res.json({message:"token verified",decode})


 }
        })





    } catch (error) {
        console.log(error);
        
    }
}
module.exports= verifyUser