"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv"); dotenv.config(); 

app.set("views", "./src/views");
app.set("view engine","ejs");
const home=require("./src/routes/home");
app.use(express.static(`${__dirname}/src/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/",home);
module.exports=app;
