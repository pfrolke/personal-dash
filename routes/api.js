var express = require("express");
var router = express.Router();
var axios = require("axios");
var { getWeekPlanning, getBirthdays } = require("../gcalendar");

router.use(function (req, res, next) {
  if (req.get("Authorization") === process.env.SECRET) {
    next();
  } else {
    res.status(401).send();
  }
});

router.get("/weather", function (req, res, next) {
  axios
    .get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        id: 2757345,
        lang: "nl",
        units: "metric",
        appid: process.env.OPENWEATHERMAP_APPID,
      },
    })
    .then(function ({ data }) {
      res.send({
        temp: Math.round(data.main.temp),
        imgSrc:
          "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png",
        desc: data.weather[0].description,
      });
    });
});

router.get("/todos", function (req, res, next) {
  axios
    .get("https://api.trello.com/1/lists/5dc1b5133037ac752d6b4834/cards", {
      params: {
        key: process.env.TRELLO_KEY,
        token: process.env.TRELLO_TOKEN,
      },
    })
    .then(function ({ data }) {
      res.send(data.map((d) => d.name));
    });
});

router.get("/weekplanning", function (req, res, next) {
  getWeekPlanning().then((events) => {
    console.table(events);
    res.send(events);
  });
});

router.get("/birthdays", function (req, res, next) {
  getBirthdays().then((names) => {
    res.send(names);
  });
});

module.exports = router;
