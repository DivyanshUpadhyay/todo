const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.Mongo_URI,{
        })
        console.log('Connected to Database');
    }catch(err)
    {
        console.log('Failed to Connect to Database',err);
        process.exit(1);
    }

};
module.exports = connectDB;