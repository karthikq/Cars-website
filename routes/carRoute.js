/** @format */
const express = require("express");
const router = express.Router();

const carsArray = require("../cars");
const racingCars = require("../CarsArray/racingCars");
const vintageCars = require("../CarsArray/vintageCars");
const suvs = require("../CarsArray/suv");

router.get("/:id", (req, res) => {
  const path = req.params.id;

  if (path === "musclecar")
    res.render("cars", { cars: carsArray, name: "Muscle cars" });
  if (path === "racingcar")
    res.render("cars", { cars: racingCars, name: "Racing cars" });
  if (path === "vintagecar")
    res.render("cars", { cars: vintageCars, name: "Vintage cars" });
  if (path === "suv") res.render("cars", { cars: suvs, name: "Suv's" });
});

module.exports = router;
