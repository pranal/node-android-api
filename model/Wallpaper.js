var mongoose=require('mongoose');


var WallpaperSchema= new mongoose.Schema({

    title:{
    type:String,
    required:true,
    minlength:1,
    trim :true

    },
    likes:{
        type:Number,
        required:true,
        default:0
    },
    timestamp:{
    type:String,
    required:true
    },
    creator: 
    [{
    _creator:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
            },
    
    creatorname: {
    type: String,
    required: false
          },
    creatordpurl: {
    type: String,
    required: false
        }

     }], 
    
          
    
   url:{
   type:String,
   trim:true,
   required:true,
    }
  });

  WallpaperSchema.methods.generateCreator = function (req) {
   
    var wallpaper = this;
    
    wallpaper.creator = wallpaper.creator.concat([{
      _creator: req.creator._id,
     }]);
  
    return wallpaper.save().then((doc) => {
      return doc;
    });
  };



  var Wallpaper=mongoose.model('Wallpaper',WallpaperSchema);

  module.exports={Wallpaper};