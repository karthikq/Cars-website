/** @format */

var firebase = require("firebase");
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBi7r_UNpFdRY5iPLM05FaPxMd07rpm-0I",
  authDomain: "food-auth-f9382.firebaseapp.com",
  projectId: "food-auth-f9382",
  storageBucket: "food-auth-f9382.appspot.com",
  messagingSenderId: "661656084046",
  appId: "1:661656084046:web:842748b8d13dd09b62ed1f",
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase;
