const mongoose =  require('mongoose');
const { Schema } = mongoose;

//useing schema from mongoose basically its like a datatypes for a particular field like name and pass and also has a unique value feature 
const UserSchema = new Schema({
 name:{
     type: String,
     required : true
 },
 email:{
     type: String,
     required : true
 },
 password:{
     type: String,
     required : true,
     unique: true
 },
 date:{
     type: Date,
     default : Date.now
 }

});

const User = mongoose.model('user', UserSchema);
module.exports = User; 