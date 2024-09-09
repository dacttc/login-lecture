"use strict";
const jwt = require("jsonwebtoken");
const express=require("express");
const router =express.Router();

const ctrl=require("./home.ctrl")

router.get('/',ctrl.output.home);
router.get('/login',ctrl.output.login);
router.get('/register',ctrl.output.register);

router.post('/register',ctrl.process.register);
router.post('/login',ctrl.process.login,);
  
module.exports=router;
const token = jwt.sign({ email: "test@user.com" }, "our_secret", {
    expiresIn: "1s",
  });
  const verified = jwt.verify(token, "our_secret");
  console.log(verified);
  
