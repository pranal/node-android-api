require('./config/config');

const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const {ObjectID} = require('mongodb');
const _=require('lodash');
var {authenticate}=require('./middleware/authenticate');
var {authenticatec}=require('./middleware/authenticate-creator')



const {User}=require('./model/User');
const{Wallpaper}=require('./model/Wallpaper');
const{Creator}=require('./model/Creator');
const{mongoose}=require('./db/mongoose');
const{Favorite}=require('./model/Favorite');

var creatorname=null;

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

app.post('/send', authenticatec, (req, res) => {

  if (!ObjectID.isValid(req.creator._id)) {
    return res.status(404).send();
  }
  creatorname=req.body.name;
 console.log(req.body.name);
 const output=`
 <p>You have a new creator request</p>
 <h3> Creator Details</h3>
 <ul>
     <li>Name:${req.body.name}</li>
     <li>Email:${req.creator.email}</li>
     
     </ul>
     <h3>Message</h3>
     `;

  let transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
     port: 587,
     secure: false, // true for 465, false for other ports
     auth: {
         user: 'pranalmyntra3@gmail.com', // generated ethereal user
         pass: 'Myntrarocks'// generated ethereal password
     },
     tls:{
         rejectUnauthorized:false
     }

 });

 // setup email data with unicode symbols
 let mailOptions = {
     from: '"Wall Admin" <pranalmyntra3@gmail.com>', // sender address
     to: 'sarveshpalav@gmail.com', // list of receivers
     subject: `Mail from creator ${creatorname}`, // Subject line
     text: 'Hello world?', // plain text body
     html: output // html body
 };

 
 transporter.sendMail(mailOptions, (error, info) => {
  creatorname=null;  
  
  if (error) {
         res.status(404).send();
         return console.log(error);

     }
     
     console.log('Message sent: %s', info.messageId);
     
     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
 
    res.status(200).send();
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

app.post('/csignup', (req, res) => {
    
  var body=_.pick(req.body,['email','password']);
  console.log(body);
  var creator= new Creator(body);
  
  creator.save().then(() => {
      
      return creator.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(creator);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });
  
  app.post('/clogin',(req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);
  
    Creator.findByCredentials(body.email,body.password).then((creator)=>{
   
    return creator.generateAuthToken().then((token)=>{
     res.header('x-auth',token).send(creator);
     });
    }).catch((e)=>{
     res.status(400).send();
    });
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

  