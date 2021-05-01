/** @format */

const express = require("express");

var bodyParser = require("body-parser");
const ejs = require("ejs");
const firebase = require("firebase");
const storage = require("./firebase/firebase");
const http = require("http");
const port = process.env.PORT || 3000;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const verifyUser = (req, res, next) => {
  let user = firebase.auth().currentUser;

  if (user) {
    req.user = user;
    next();
  } else {
    res.redirect("/user/login");
  }
};

app.use("/cars", verifyUser, require("./routes/carRoute"));
app.use("/user", require("./routes/userAuth"));

app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/about", (req, res) => {
  const aboutPath = req.query.user;
  const aboutAuth = req.query.auth;

  if (!aboutAuth) {
    res.render("about");
  } else {
    res.render("about", { auth: aboutAuth, user: aboutPath });
  }
});

app.get("/home", (req, res) => {
  const authenticate = req.query.auth;
  const userName = req.query.user;

  if (authenticate) {
    let user = firebase.auth().currentUser;
    if (user) {
      res.render("home", { auth: true, user: userName });
    }
  } else {
    res.render("home");
  }
});
app.listen(port, () => {
  console.log("server is running");
});
