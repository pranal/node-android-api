const {Creator}=require('./../model/Creator');

var authenticatec= (req,res,next)=>{
    var token =req.header('x-auth');
  console.log('tets');
    Creator.findByToken(token).then((creator)=>{
     if(!creator){
         console.log('test2');
      return Promise.reject();

    }
     
     req.creator=creator;
    req.token=token;
    next();
    }).catch((e)=>{
    res.status(401).send();
    });
  };

  module.exports= {authenticatec};  