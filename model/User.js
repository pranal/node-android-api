const mongoose=require('mongoose');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const validator=require('validator');

var UserSchema=new mongoose.Schema({

    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
        }
    },
    
    password: {
        type: String,
        require: true,
        minlength: 6
                }
        
});

var User=mongoose.model('User',UserSchema);

module.exports={User}

