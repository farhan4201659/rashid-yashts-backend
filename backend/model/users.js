import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate : validator.isEmail,
    unique : true,
  },
  password: {
    type: String,
    required: true,
  },
  activeToken : {
    type : String,
  },
  activeTokenExpires : {
    type : Date,
  },
  isActive : {
    type : Boolean,
    default : false,
  },

});



// Hash Password

schema.pre("save" , async function(next){

  if(!this.isModified("password")){
    next();  
  }
  
  this.password = await bcrypt.hash(this.password , 10);
    
});


// Compare Password

schema.methods.comparePassword = async function(password){

  return await bcrypt.compare(password , this.password);

}


// Creating JWT Token

schema.methods.getJwtToken = function(){
  return jwt.sign({id : this._id} , process.env.JWT_SECRET)
}

// Generating Active Link Token

schema.methods.activeLinkToken = function(){
  
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.activeToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.activeTokenExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};



export const User = mongoose.model("User", schema);