const mongoose=require('mongoose');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const validator=require('validator');



var CreatorSchema=new mongoose.Schema({

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
                },
    
    
     tokens: [{
        access: {
         type: String,
        required: true
             },
      token: {
          type: String,
             required: true
             },
         }],         

    
        
});

CreatorSchema.methods.generateAuthToken = function () {
   
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET).toString();
  console.log(token);
    user.tokens = user.tokens.concat([{
      access: access,
      token: token
     }]);
  
    return user.save().then(() => {
      return token;
    });
  };

  CreatorSchema.statics.findByCredentials=function (email,password){
    
      
    var Creator=this;
    
   
    return Creator.findOne({email}).then((creator)=>{
      if(!creator){

      return Promise.reject();
      }
 
      return new Promise((resolve,reject)=>{
       bcrypt.compare(password,creator.password,(err,res)=>{
       if(res){
         resolve(creator);
       }else{

         reject();
       }
       });
      });
    });
   };
   CreatorSchema.statics.findByToken= function(token){
    var Creator = this;
    var decoded;
  
  try{
    decoded=jwt.verify(token,process.env.JWT_SECRET);
    
  }
  catch(e){
     console.log('test1');
    return Promise.reject();
  
  }
   return Creator.findOne({
     '_id':decoded._id,
     'tokens.token':token,
     'tokens.access':'auth'
  });
  };


   CreatorSchema.pre('save',function(next){
    var creator=this;
 
    if (creator.isModified('password'))
    {
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(creator.password,salt,(err,hash)=>{
            creator.password= hash;
            next();
        });
      });
 
    }else{
      next();
    }
   });

var Creator=mongoose.model('Creator',CreatorSchema);

module.exports={Creator}