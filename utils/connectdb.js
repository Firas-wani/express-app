const mongoose = require ('mongoose');
const {config} = require ('dotenv');
config('/.env')
const url = process.env.MONGO_URL;
const connectDb = async ()=>{
    try {
        await mongoose.connect(url)
        console.log("Db connected");
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = connectDb 