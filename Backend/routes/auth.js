const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const { json } = require("express");
const fetchuser = require("../middleware/fetchuser");


const JWT_secret = "thisismySecretpleasedonttellanyone"

// Route 1: Create a User using: POST "/api/auth/createuser". No login required
//this code is post request with an endpoint of create user and some validation for name email and password
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    //if there are errors return bad request with error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //check if user with same email exits
    try {
      let success = false;
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success,  errors:  "Sorry email with this email already exit!" });
      }
       
      //making password secure by using hash and salt
       const salt = await bcrypt.genSalt(10);
       const securedpass = await bcrypt.hash(req.body.password, salt);

      //if user doesnt have same email make their entry then 
      user = await User.create({
        name: req.body.name,
        password: securedpass,
        email: req.body.email,
      });

       const data = {
           user:{
               id : user.id,
           }
       }
        const authToken = jwt.sign( data, JWT_secret);
        
    //   res.json(user);
     success = true;
    res.json({success,authToken});

      //catching error if anything goes wrong
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }

    //this was the error message for mail before writing try catch logic
    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    // res.json({error: 'Please enter a unique value for email', message: err.message})})
  }
);

// Route 2: Create a login endpoint  using: POST "/api/auth/login". No login required
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password cannot be blank").exists(),  
    ],
    async (req, res) => {
      let success = false;
        //if there are errors return bad request with error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;               //this will compare email and pass with the body
        try {
            let user = await  User.findOne({email});             //if user exits then show him the data 
            success = false;
            if(!user){                                           //if email is incorrect then give this error
                return res.status(400).json({error: "Please login with correct details"})
            }
             
            //comparing password 
             const passwordCompare =  await bcrypt.compare(password, user.password)
          if(!passwordCompare){               //if password doesnt matches give the below error
            success = false;
            return res.status(400).json({success ,error: "Please login with correct details"})

          } 
          //below data will be given if login is successful
          const data = {
            user:{
                id : user.id,
            }
        }
        const authToken = jwt.sign( data, JWT_secret);
        success = true;

        res.json({success,authToken});         //sending data in jsom for now

            } catch (error) {          //this catch error if theres an error while logining
                console.error(error.message);
                res.status(500).send("Internal Server Error");             
              }
    
    }
);

// Route 3: Getting login user detail  using: POST "/api/auth/getuser".  login required

router.post(
  "/getuser", fetchuser ,  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
      
    } catch (error) {          //this catch error if theres an error while logining
      console.error(error.message);
      res.status(500).send("Internal Server Error");             
    }
  })
 








module.exports = router;
