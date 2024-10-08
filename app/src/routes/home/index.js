"use strict";
const jwt = require("jsonwebtoken");
const express=require("express");
const router =express.Router();
const cookieParser = require('cookie-parser');
const app = express();
router.use(cookieParser());
// cookie-parser 미들웨어 적용
app.use(cookieParser());
const ctrl=require("./home.ctrl")

//  router.get('/',ctrl.output.home);
router.get('/login',ctrl.output.login);
router.get('/register',ctrl.output.register);

router.post('/register',ctrl.process.register);
router.post('/login',ctrl.process.login,);
router.post('/cookiecheck',ctrl.process.cookiecheck);

router.get("/:id", ctrl.output.mypage);
// app.get("/:id", (request, repones) => {
//     const userName = users[request.params.id - 1];
//     repones.end(`<h1>${userName}</h1>`);
//   });


module.exports=router;
