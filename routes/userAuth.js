/** @format */

const express = require("express");
const router = express.Router();

const firebase = require("../firebase/firebase");
const storage = firebase.firestore();
const Joi = require("joi");

router.get("/login", (req, res) => {
  let errors = [];
  res.render("login", { errors: errors });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let errors = [];
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      const id = user.user.uid;
      storage
        .collection("users")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            res.redirect(
              "/home" + "?" + "auth=true" + "&user=" + doc.data().name
            );
          } else {
            errors.push({ error: "user not found" });
            return res.render("login", { errors: errors });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      var errorMessage = err.message;
      errors.push({ error: errorMessage });
      res.render("login", { errors: errors });
    });
});
router.get("/register", (req, res) => {
  let errors = [];
  res.render("register", { errors: errors });
});
router.post("/register", (req, res) => {
  const { username, email, password, password2 } = req.body;

  let errors = [];

  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().min(3).email().required(),
    password: Joi.string().required().min(6),
    password2: Joi.any().valid().required(),
  });
  if (password != password2) errors.push({ error: "Password's don't match" });
  const { error, value } = schema.validate(req.body);
  if (error) {
    errors.push({ error: error.details[0].message });
  }

  if (errors.length != 0) res.render("register", { errors: errors });

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const storageRef = storage
        .collection("users")
        .doc(userCredential.user.uid);

      const { serverTimestamp } = firebase.firestore.FieldValue;
      let user = userCredential.user;
      storageRef
        .set({
          name: username,
          id: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
        })
        .catch((err) => {
          console.log(err);
        });

      return res.redirect("/home" + "?" + "auth=true" + "&user=" + username);
    })

    .catch((error) => {
      console.log(error);
      var errorCode = error.code;
      var errorMessage = error.message;
      errors.push({ error: errorMessage });
      res.render("register", { errors: errors });
    });
});

router.get("/logout", (req, res) => {
  let user = firebase.auth();
  user
    .signOut()
    .then(function () {
      res.redirect("/home");
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
