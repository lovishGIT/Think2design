const jwt  = require('jsonwebtoken');
const JWT_TOKEN = "IAMVIHAANSINGLA";
const validator  = require('validator');
const fetchuser = (req,res,next)=>{

   const token = req.header('auth-token');
   if(!token){
       res.send({status:"error",message:"Invalid request token"});
   }

   if(!validator.isJWT(token)){
    res.send({status:"error",message:"Invalid request token"});
   }

   try{
   const data  = jwt.verify(token,JWT_TOKEN);
   req.user = data.user;   
    next();
    
   }
   catch(error){
      res.send({status:"error",message:"Invalid request token"});

   }
}

module.exports = fetchuser;