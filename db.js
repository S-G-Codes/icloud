const mongoose = require("mongoose");

const mongoURL ='mongodb://localhost:27017/icloudNB?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

//making a function to connect to mongodb
const connectToMongo = () =>{
    mongoose.connect(mongoURL, ()=>{
        console.log('Connect to Mongoose successfully');
        
    })
}

module.exports =  connectToMongo;