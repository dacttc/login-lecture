"use strict";
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.set("views", "./src/views");
app.set("view engine","ejs");
const home=require("./src/routes/home");
app.use(express.static(`${__dirname}/src/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/",home);

if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports=app;
