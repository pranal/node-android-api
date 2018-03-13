require('./config/config');
const express=require('express');
const bodyParser=require('body-parser');
const _=require('lodash');
const {User}=require('./model/User');
const{mongoose}=require('./db/mongoose');

var app=express();
const port = process.env.PORT||3000;


app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    
var body=_.pick(req.body,['email','password']);
console.log(body);
var user= new User(body);

user.save().then(()=>{
    console.log('User signed up');
    res.status(200).send();
}).catch((e)=>{
    res.status(400).send(e);
});



  });
  










app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });

  