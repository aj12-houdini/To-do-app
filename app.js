//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./src/controller"));

app.listen(2001, function () {
  console.log("Server started on port 5000");
});
