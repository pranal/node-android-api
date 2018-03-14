var mongoose=require('mongoose');


var Favorite=mongoose.model('Favorite',{
    userid:{
    type:String,
    required:true,
    minlength:1,
    trim :true

    },
    wallpaperid:{
        type:String,
        required:true,
    },
    timestamp:{
        type:String,
        required:true,
    }
  
  });
  module.exports={Favorite}
  

  
