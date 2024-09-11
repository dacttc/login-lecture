"use strict";
const express = require('express');
const db = require("../../config/db");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const UserStorage = require("../../models/UserStorage");


const output = {


  login: (req, res) => {
    res.render("home/login")
  }
  ,
  register: (req, res) => {
    res.render("home/register")
  },
  mypage: (req, res) => {


    res.render("home/mypage")

  }

};


const process = {

  cookiecheck: (req, res) => {

    //  console.log(req.cookies.authToken);
    //homeController.home(req, res);
    const token = req.cookies.authToken; // 클라이언트가 보낸 쿠키에서 토큰을 가져옴

    if (!token) {
      db.query('SELECT * FROM service', (err, results) => {
        if (err) {
          console.error('쿼리 실행 오류:', err.stack);
          return;
        }

      
          return res.json({
            ids: null, own: false, message: 'Success',
            ...results // 결과의 첫 번째 레코드를 응답에 포함
          });
      

      });
    }
    else{
    // JWT 검증
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      }

      // 토큰이 유효하면, 디코딩된 사용자 정보를 요청 객체에 저장


      db.query('SELECT * FROM service', (err, results) => {
        if (err) {
          console.error('쿼리 실행 오류:', err.stack);
          return;
        }

        if (decoded.id == req.body.username) {
          return res.json({
            ids: decoded.id, own: true, message: 'Success',
            ...results // 결과의 첫 번째 레코드를 응답에 포함
          });
        }
        else {
          return res.json({
            ids: decoded.id, own: false, message: 'Success',
            ...results // 결과의 첫 번째 레코드를 응답에 포함
          });
        }

      });
      // return res.json({ id: req.userId });


    });
  }
  },

  login: async (req, res) => {
    try {
      const user = new User(req.body);
      const response = await user.login();

      jwt.sign({ id: req.body.id }, "secretKey", { expiresIn: '30m' }, (err, token) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to generate token' });
        }

        // 쿠키 설정
        res.cookie('authToken', token, {
          httpOnly: true,
          maxAge: 30 * 60 * 1000 // 30분
        });

        // JWT 설정 후 응답 전송
        return res.status(200).json(response);
      });
    } catch (error) {
      // 로그인 과정에서 에러 발생 시 처리
      return res.status(500).json({ error: 'Login failed' });
    }
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
