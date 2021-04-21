function getParameterByName(variable) {
	var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
}

window.addEventListener("load", function () {
	setTimeout(function() {

	}, 120000);

  /* weather update */
  var appid = getParameterByName("appid");
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

  greeting.innerHTML = greet + " Paul";

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

  var timeText;

  if (minTextIndex == 0) {
    timeText = timeText.charAt(0).toUpperCase() + timeText.slice(1) + " uur";
  } else {
		timeText = minText[minTextIndex] + " " + hourText[hourTextIndex]
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
