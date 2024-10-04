const mongoose = require("mongoose");
const Product = mongoose.model("Product",{
price:Number,
title:String,
imageUrl : String,
description:String


})

/// Create the Cart schema
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for foreign key
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for foreign key
        required: true,
        ref: 'Product' // Assuming you have a Product model
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Minimum quantity should be 1 or more
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the Cart model
const cart = mongoose.model('Cart', cartSchema);

// Export both models

module.exports= {Product, cart}