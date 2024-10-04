const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const messageHandler=require("../utils/utils")
const jwt =require("jsonwebtoken");
const nodemailer = require("nodemailer");
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
        res.json({msg:"user created sucessfully"})
       
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
    if(id){
        const deleteUser = await User.findByIdAndDelete(id);
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
// forgot password
// const handleForgotPassword = async (req, res)=>{
// try {
//     const {email} = req.body;

// if(!email){
//     return res.status(400).send({message:"Email Required"})
// }

// const checkUser = await  User.findOne({email});
// if(!checkUser){
//     return res.status(400).send({message:"User not found"});

// }

// const token = jwt.sign({email},process.env.SECRET_KEY,{expiresIn:"1h"});
// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     secure:true,
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS,
//     },
// })
// const receiver = {
//     from: "",
//     to:email,
//     subject:"Password reset link",
//     text:`click on this link to generate new passsword ${process.env.CLIENT_URL}/reset-password ${token}`
// }

// await transporter.sendMail(receiver);
// return res.status(200).send({message:"password reset link sent successfully to your gmail account"})


// } catch (error) {
    
//     console.log(error);
    

//     return res.status(500).send({message:"something went wrong"});
    
// }
// }

// const resetPassword = async (req, res)=>{
// try {
// const {token} = req.params;
// const {password} = req.body;

// if(!password){
//     return res.status(400).send({message:"please provide password"})
// }


// const decode = jwt.verify(token, process.env.SECRET_KEY)


// const user = await user.findOne({email:decode.email});

// const newhashPassword = await hashPassword(password);

// user.password = newhashPassword;
// await user.save();

// return res.status(200).send({message:"Password reset successfully"})
// } catch (error) {
//     return res.status(500).send({message:"something went wrong"})
//     console.log(error);
    
// }
// }




   module.exports =  {handleSignUp, handleLogin, getUserDetails, editUser, deleteUser,}