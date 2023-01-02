const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_TOKEN = "IAMVIHAANSINGLA";
const REFRESH_TOKEN = "IAMVIHU@";
const fetchuser = require("../../middlewares/fetchuserdata")
const User = require("../../models/Users");
var nodemailer = require('nodemailer');


async function checkIfUserExists(email) {
    return User.findOne({ email: email })
        .then(user => user ? true : false)
        .catch(() => false);
}

function generatedigits(){
return Math.floor(100000 + Math.random() * 900000)
}


function sendmail(otp,email){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'singlakhush201@gmail.com',
          pass: 'nannmetaiwyvvlzj'
        }
      });
      
      var mailOptions = {
        from: 'singlakhush201@gmail.com',
        to: `${email}`,
        subject: "E-Station Verification Code",
        text: `Your OTP ${otp}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.send(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send(info.response);
        }
      });

}

router.post("/sendmail",async(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'singlakhush201@gmail.com',
          pass: 'nannmetaiwyvvlzj'
        }
      });
      
      var mailOptions = {
        from: 'singlakhush201@gmail.com',
        to: 'vihaansingla555@gmail.com',
        subject: "E-Station Verification Code",
        text: `Your OTP ${generatedigits()}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.send(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send(info.response);
        }
      });
      

})

//Login
router.post("/login",async(req,res)=>{

    try{
  const {email,password} = req.body;
    
  if(!email || !password){
    return res.status(403).json({error:"Email and Password is incorrect"});
  }
  else{
      
      const userdata = await User.findOne({email: email});
      const isvalid =  await bcrypt.compare(password, userdata.password);
      if(isvalid){
        
        res.status(201).json({success:"Login Successful"});

      }
      else{
        return res.status(403).json({error:"Email and Password is incorrect"});
        
      }

  }

}catch(error){
    res.status(400).send({error:"Some Internal Server Error"})
}

});

//Register
router.post("/checktoken", fetchuser, async (req, res) => {
  console.log(req.user);
  if (req.user.status === "error") {
    res.send({ status: "error" });
  } else {
    res.send({ status: "success" });
  }
});

router.post('/register',async(req,res)=>{
    
    try{
        const {firstname,lastname,email,password,city,pincode,state} = req.body.data;
        console.log(req.body.data)
        if(!firstname || !lastname || !email || !password || !city || !pincode || !state){
            // 422 error code
            return res.json({status: "error",message:"Some fields are missing"});
        }
        const userExist = await checkIfUserExists(email);
        if(userExist){
            res.json({status:"error",message:"Email already exists"});
        }
        else{
        const  verification_code = generatedigits();
        const flag = 0;
        const userdata = new User({firstname,lastname,email,password,city,state,pincode,flag,verification_code});
        await userdata.save();
        console.log(userdata._id);
        // we need to show created when created which is 201
        // sendmail(verification_code,email);
        const data = {
          user: {
            id: userdata._id,
            name: userdata.firstname,
          },
        };

        const authtoken = jwt.sign(data, JWT_TOKEN);

       

        // res.cookie("tok__", refreshToken, {
        //   maxAge: 24 * 60 * 60 * 1000,
        //   httpOnly: true,
        //   // secure: true
        // });
        return res.json({
          status: "success",
          authtoken: authtoken,
          message:"Data saved successfully"
        });
        }
    }
    catch(err){
        // it should show error status 400 when there is an error
        return res.json({status:"error",message:"Some Internal Server Error"});
    }
})

module.exports = router;
