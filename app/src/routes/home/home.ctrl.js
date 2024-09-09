"use strict";

const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const UserStorage = require("../../models/UserStorage");

const output = {

  home: (req, res) => {
    res.render("home/index")
  },
  login: (req, res) => {
    res.render("home/login")
  }
  ,
  register: (req, res) => {
    res.render("home/register")
  }


};


const process = {


  login: async (req, res) => {
    const user = new User(req.body);
    const response =await  user.login();
    
    jwt.sign({id: req.id}, "secretKey", { expiresIn: '30m' }, (err, token) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to generate token' });
      }
   
       res.cookie('authToken', token, { // 쿠키 이름과 값 설정
          httpOnly: true, // 클라이언트 측 스크립트에서 쿠키에 접근하지 못하도록 설정
          
          maxAge: 30 * 60 * 1000 // 쿠키 유효 시간 설정 (30분)
      })
      ;
     
    });
     return res.json(response).status(200);
 

  },
  register: async (req, res) => {
    const user = new User(req.body);
    const response = await user.register();
    return res.json(response);
  },

};

module.exports =
{
  output, process,
};
