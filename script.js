// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.addEventListener("load", function () {
  /* weather update */
  var appid = getParameterByName("appid");
  if (appid) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
      var weatherData = JSON.parse(this.responseText);
      var weatherTemp = document.getElementById("weather-temp");
      var temp = Math.round(weatherData.main.temp);
      weatherTemp.innerHTML = temp;
    });
    oReq.open(
      "GET",
      "https://api.openweathermap.org/data/2.5/weather?id=2757345&units=metric&appid=" +
        appid
    );
    oReq.send();
  }

  /* greeting update */
  var greeting = document.getElementById("greeting");
  var date = new Date();

  var greet = "Mogguh";
  if (date.getHours() > 12) {
    greet = "Hallo";
  }
  if (date.getHours() > 22 || date.getHours < 5) {
    greet = "Truste";
  }

  greeting.innerHTML = greet;

  /* datetime update */
  var timedate = document.getElementById("timedate");

  var minTextIndex = Math.round((date.getMinutes() / 60) * 12) % 12;
  var minText = [
    "",
    "Vijf over",
    "Tien over",
    "Kwart over",
    "Tien voor half",
    "Vijf voor half",
    "Half",
    "Vijf over half",
    "Tien over half",
    "Kwart voor",
    "Tien voor",
    "Vijf voor",
  ];

  var hourTextIndex = date.getHours();
  if (minTextIndex >= 4) {
    hourTextIndex++;
  }
  hourTextIndex = hourTextIndex % 12;
  var hourText = [
    "twaalf",
    "één",
    "twee",
    "drie",
    "vier",
    "vijf",
    "zes",
    "zeven",
    "acht",
    "negen",
    "tien",
    "elf",
  ];

  var timeText = minText[minTextIndex] + " " + hourText[hourTextIndex];

  if (minTextIndex == 0) {
    timeText = timeText.charAt(0).toUpperCase() + timeText.slice(1) + "uur";
  }

  var monthIndex = date.getMonth();
  var monthText = [
    "Jan",
    "Feb",
    "Mrt",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ][monthIndex];

  var dayText = date.getDate();

  var datetimeText = timeText + ", " + dayText + " " + monthText;

  timedate.innerHTML = datetimeText;
});
