const mongoose  = require('mongoose');
// import validator from "validator";
const validator = require('validator');
const bcrypt  = require('bcryptjs');
const userSchema = new mongoose.Schema({
    firstname :{
        type : String,
        require: true,
        minlength :3
    },
    surname:{
        type : String,
        require: true,
        minlength :3
    },
    email :{
        type : String,
        require: true,
        unique:[true, "Email id already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid Email")
            }
        }
    },
    password:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    }
    ,
    state:{
        type:String,
        require:true
    },
    pincode:{
        type:String,
        require:true
    }
    // address : String
})

// we will create a new collection
// User is a colllection
userSchema.pre('save',async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})
const User = new mongoose.model('User',userSchema);

module.exports =  User