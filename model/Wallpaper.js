var mongoose=require('mongoose');


var Wallpaper=mongoose.model('Wallpaper',{
    title:{
    type:String,
    required:true,
    minlength:1,
    trim :true

    },
    likes:{
        type:Number,
        required:true,
        default:'0'
    },
    timestamp:{
    type:Number,
    default:null,
    required:true
    },
    creator:{
     type:String,
     required:true,
    },
    url:{
   type:String,
   trim:true,
   required:true,
    }
  });

  module.exports={Wallpaper};