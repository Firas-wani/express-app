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

// userdetails
 const getUserDetails=async(req,res)=>{
    try {
        const _id=req.user;
        if(_id){
            const getUser=await User.findById(_id)
            messageHandler(res,200,{
                userDetails:getUser
            });
        }
    } catch (error) {
        console.log(error)
    }
}
// edit user
const editUser = async(req,res)=>{
    try {
        const {username, email} = req.body;
       const _id = req.user;
       const findUser = await  User.findById(_id);
       if (findUser){
        const editUser = await User.findByIdAndUpdate(_id,{
            email,
            username
        })
        if(editUser){
          return messageHandler(res,202,"user updated sucessfully")
        }else{
            res.json({message:"some error"})
        }
       }

 } catch (error) {
        console.log(error);
        
    }
}
// delete user
const deleteUser = async(req,res)=>{
try {
    const id = req.user;
    if(_id){
        const deleteUser = await User.findByIdAndDelete(_id);
        if (deleteUser){
            return messageHandler(res,200, "User Deleted")
        }else{
            res.json({message:"no user"})
        }

    }
} catch (error) {
    console.log(error);
    
}
}

   module.exports =  {handleSignUp, handleLogin, getUserDetails, editUser, deleteUser}