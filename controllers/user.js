const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//@route REGISTER USER API // 
router.post("/register",[
  check('firstname','firstname is required').not().isEmpty(),
  check('lastname','lastname is required').not().isEmpty(),
  check('email','please enter a valid email').isEmail(),
  check('password','enter a password with minimum 6 length').isLength({min:6})
], async (req, res) => {
  //validation applied//
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("validation error encountered:",{errors: errors.array()});
    return res.status(400).json({errors: errors.array()});
  }

  const {firstname,lastname, email, password} = req.body;
  try{
    //check if user exists or not
    let user = await User.findOne({email});
     if(user){
        return res.status(500).json({error: {msg: 'user already exists'}});
     }

  //Creating new user
  user = new User({
    firstname,
    lastname,
    email,
    password
  });

  //generating salt
  const salt = await bcrypt.genSalt(10); //by default 10

  user.password = await bcrypt.hash(password,salt); //hashing of password done using salt

  //save user in database now
  await user.save().then((record) => res.status(201).json({
    message: "Successfully registered",
    user:record
  }));

  }catch(err){
    console.log("error message:",err.message);
    res.status(500).json({error: {msg: err.message}});
  }
});

//@route Login user API // 
 router.post("/login",[
  check('email','please enter a valid email').isEmail(),
  check('password','please enter a valid password').not().isEmpty(),
  ],async (req, res) => {

    //validation applied//
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log("validation error encountered:",{errors: errors.array()});
      return res.status(400).json({errors: errors.array()});
    }

    try{
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const isValidPassword = await bcrypt.compare(req.body.password, user.password);
          isValidPassword ? res.status(200).json({ message: "Successfully logged in",id:user._id }) : res.status(400).json({error: {msg: "Invalid Password"}});
        } else {
          console.log( "error message : User does not exist");
          res.status(401).json({error: {msg: "user does not exist"}});
        }
    }catch(err){
      console.log("error message:",err.message);
      res.status(500).json({error: {msg: err.message}});
    }
});

//@route GET user by id API // 
router.get("/:id", async (req, res) => {
  try{
    var user = await User.findById(req.params.id).select('-password');
    if(user){
      console.log("fetching user record");
      res.status(200).json(user);
    }else{
      res.status(401).json({error: {msg: "user does not exist"}});
    }
  }catch(err){
    console.log("error message:",err.message);
    res.status(500).json({error: {msg: err.message}});
  }
});

//@route Update user by id // 
router.put("/:id",async (req,res)=>{
  try{
    const { firstname, lastname, email } = req.body;
    const userId = req.params.id;

    let password = req.body.password;
    let newPassword = req.body.newPassword;

    if(password && newPassword){
      if(newPassword.length>=6){
        var user = await User.findById(userId);
        if(user){
          const isMatched = await bcrypt.compare(password, user.password);
        //If matched then user is allowed to update password
          if(isMatched){
              //encrypting password
              const salt = await bcrypt.genSalt(10);
              password = await bcrypt.hash(newPassword,salt);
              await User.findByIdAndUpdate(userId,{ firstname, lastname, email, password });
              res.status(200).json({message:"request completed and password got updated"});
          }else{
            res.status(400).json({error: {msg: "Please enter correct password"}});
          }
        }else{
          res.status(401).json({error: {msg: "user does not exist"}});
        }
      }else{
       res.status(400).json({error: {msg: "new password not strong"}});
      }
    }else{
      await User.findByIdAndUpdate(userId,{ firstname, lastname, email });
      res.status(200).json({message:"user updated successfully"})
    }
  }catch(err){
    console.log("error message:",err.message);
    res.status(500).json({error: {msg: err.message}});
  }
});

//@route DELETE user by id //
router.delete("/:id", async (req,res)=>{
  try{
    let userId = req.params.id;
    let deleteUser = await User.findByIdAndDelete(userId);
    res.status(200).json({message:"user deleted successfully", deletedUser: deleteUser});
  }catch(error){
    console.log("error message:",err.message);
    res.status(500).json({error: {msg: err.message}});
  }
});

module.exports = router;
