require('./config/config');

const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const _=require('lodash');
var {authenticate}=require('./middleware/authenticate');


const {User}=require('./model/User');
const{Wallpaper}=require('./model/Wallpaper');
const{mongoose}=require('./db/mongoose');
const{Favorite}=require('./model/Favorite');

var app=express();
const port = process.env.PORT||3000;


app.use(bodyParser.json());


app.post('/wallpapers',(req, res) => {
  var body=_.pick(req.body,['title','likes','timestamp','creator','url']);
  var wallpaper= new Wallpaper(body);

  wallpaper.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});



app.post('/favorites',(req, res) => {
  var body=_.pick(req.body,['userid','wallpaperid','timestamp']);
  var favorite= new Favorite(body);

  favorite.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/favorites',authenticate,(req,res)=>{
  
  if (!ObjectID.isValid(req.user._id)) {
    return res.status(404).send();
  }
  
  var array1=[];
  Favorite.find({
  userid:req.user._id

  }).then((favorites)=>{
    favorites.forEach(function(favorite){
     array1.push(favorite.wallpaperid);
     
    })
    Wallpaper.find({
      _id:array1
    })
    .then((wallpapers)=>{
     res.send(wallpapers);
    })
 },(e)=>{
   res.status(400).send(e);
 })
});

app.get('/wallpapers',(req, res) => {
  Wallpaper.find().sort('-likes').then((wallpapers) => {
    res.send({wallpapers});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/recent',(req, res) => {
  Wallpaper.find().sort('-timestamp').then((wallpapers) => {
    res.send({wallpapers});
  }, (e) => {
    res.status(400).send(e);
  });
});




app.post('/signup', (req, res) => {
    
var body=_.pick(req.body,['email','password']);
console.log(body);
var user= new User(body);

user.save().then(() => {
    
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});


app.post('/login',(req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email,body.password).then((user)=>{
      
    return user.generateAuthToken().then((token)=>{
     res.header('x-auth',token).send(user);
     });
    }).catch((e)=>{
     res.status(400).send();
    });
  });  
  
  app.delete('/logout/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
      res.status(200).send();
    },()=>{
     res.status(400).send();
    });
    });
  










app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });

  