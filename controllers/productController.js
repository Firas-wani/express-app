const {Product, cart} = require("../models/productsModel");
const messageHandler = require("../utils/utils");
const cloudinary = require("cloudinary");
const {config} = require("dotenv");
config("/ .env")
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  const handleProductCreation = async (req, res) => {
    try {
 
      const { title ,description ,price} = req.body;
      const image = req.file.path;
  
      if (title === "" || !image ||!description ||!price) {
        return messageHandler(res, 203, "All Feilds Required");
      }
  
      const upload = await cloudinary.uploader.upload(image);
      if (!upload) {
        return messageHandler(res, 200, "Cloudinary Error");
      }
  
      const imageUrl = upload.secure_url;
  
      const newProduct = await Product.create({ title, imageUrl, description,price });
      if (newProduct) {
        return messageHandler(res, 201, "Post Created Sucessfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

// get products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); 
    if (products.length === 0) {
      return messageHandler(res, 200, "No Products Available");
    }
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    return messageHandler(res, 500, "Server Error");
  }
};

// add to cart

const handleAddToCart = async(req,res)=>{
  const {userId, productId, quantity} = req.body;
  try {
    

const product = await Product.findById(productId);
if(!productId){
  return messageHandler (res,404, "Product not found")
}
const cartItem =  await cart.findOne({userId, productId})
if(cartItem){
cartItem.quantity += quantity;
 
await cartItem.save();
  return messageHandler (res, 202 , "Product added to cart")


}else{
  cartItem = await Cart.create({userId, productId, quantity});
  return messageHandler (res, 202 , "Product added to cart")
}

  } catch (error) {
    console.log(error);
    return messageHandler(res, 500, "Server Error");
  }
}

// delete product

const deleteProduct = async(req,res)=>{
try {
  const productId = req.params.id;
if(productId){
  const deleteProduct = await Product.findByIdAndDelete(productId);
  if(deleteProduct){
    return messageHandler(res, 200, "Producted Deleted" )
  }else{
    return messageHandler(res, 404, "No Products Found")
  }
}
} catch (error) {
 console.log(error);
 return messageHandler(res, 500, "Server Error")
  
}
}









module.exports = { handleProductCreation, getProducts, handleAddToCart, deleteProduct };


