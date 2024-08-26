const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const messageHandler=require("../utils/utils")
const jwt =require("jsonwebtoken");
const {config} = require ('dotenv');
config("/.env")


const secretKey=process.env.SECRET_KEY



const handleSignUp = async(req, res)=>{
try {
    const {username, email, password} = req.body;
    if(username !== "" && email !== "" && password !== ""){
const findUser = await User.findOne({email});
if(findUser){
res.json({msg: "user already exists"});

}else{
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({username,
        email,
        password: hashPass
    });
    if(newUser){
        res.json({msg:"user Saved"})
       
}

}
}

    else{
    res.json({msg:"All Credentials Required"})
    }
} catch (error) {
    
    console.log(error);
    
}
}
  
const handleLogin = async(req, res)=>{
try {


    const { email, password } = req.body;
    if(email ==="" || password===""){
        return messageHandler(res,202,"All Credentials Required")
    }
    const existingUser=await User.findOne({email});
    if(!existingUser){
        return messageHandler(res,202,"User not Found")
    }
    const checkPassword=await bcrypt.compare(password,existingUser.password);
    if(!checkPassword){
        return messageHandler(res,202,"Password Incorrect")
    }else{
    
        const payload =existingUser._id;
        const token = await jwt.sign({_id:payload},secretKey);
        if(token){
            res.cookie("token",token)
            res.status(200).json({message:"User Logged in Sucessfully"})
        }

        
    }


}catch(error) {
    console.log(error);
    
}
}






   module.exports =  {handleSignUp, handleLogin}