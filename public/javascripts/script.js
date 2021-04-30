window.addEventListener("load", function () {
  update();
  updateWeekPlanner();
  setInterval(update, 120000);
});

function getSecret() {
  var query = window.location.search;
  return query.split("=")[1];
}

function update() {
  updateWeather();
  updateGreeting();
  updateTimeDate();
  updateTodos();
}

function getAPI(url, callback) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function () {
    callback(JSON.parse(this.responseText));
  });
  oReq.open("GET", "/api" + url);
  oReq.setRequestHeader("Authorization", getSecret());
  oReq.send();
}

function updateWeather() {
  getAPI("/weather", function (data) {
    var weatherTemp = document.getElementById("weather-temp");
    var weatherText = document.getElementById("weather-text");
    var weatherImg = document.getElementById("weather-img");
    weatherTemp.innerHTML = data.temp;
    weatherText.innerHTML = data.desc;
    weatherImg.src = data.imgSrc;
  });
}

function updateGreeting() {
  var greeting = document.getElementById("greeting");
  var date = new Date();

  var greet = "Mogguh";
  if (date.getHours() > 12) {
    greet = "Hallo";
  }
  if (date.getHours() > 22 || date.getHours() < 5) {
    greet = "Truste";
  }

  greeting.innerHTML = greet + " Paul";
}

function updateTimeDate() {
  var timeHTML = document.getElementById("time-text");
  var dateHTML = document.getElementById("date-text");
  var date = new Date();

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
    timeText =
      hourText[hourTextIndex].charAt(0).toUpperCase() +
      hourText[hourTextIndex].slice(1) +
      " uur";
  } else {
    timeText = minText[minTextIndex] + " " + hourText[hourTextIndex];
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

  timeHTML.innerHTML = timeText;
  dateHTML.innerHTML = dayText + " " + monthText;
}

function updateTodos() {
  getAPI("/todos", function (todos) {
    var todosList = document.getElementById("todos-list");
    todosList.innerHTML = "";

    for (var i = 0; i < todos.length; i++) {
      var listItem = document.createElement("LI");
      listItem.innerHTML = todos[i];
      todosList.appendChild(listItem);
    }
  });
}

function updateWeekPlanner() {
  var wpDate = new Date();
  var wpHeads = document.getElementById("wp-headers");
  var daysTxt = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
  wpHeads.innerHTML = "";
  wpHeads.appendChild(document.createElement("TH"));

  for (var i = 0; i < 4; i++) {
    var th = document.createElement("TH");
    th.innerHTML = daysTxt[(wpDate.getDay() + i) % 7];
    wpHeads.appendChild(th);
  }

  getAPI("/weekplanning", function (events) {
    for (var iTimeslot = 0; iTimeslot < 4; iTimeslot++) {
      for (var iDay = 0; iDay < 4; iDay++) {
        var eventItems = events[iTimeslot][iDay];
        var eventList = document.getElementById("wp-" + iTimeslot + iDay);
        eventList.innerHTML = "";

        for (var i = 0; i < eventItems.length; i++) {
          var listItem = document.createElement("LI");
          listItem.innerHTML = eventItems[i].summary;
          eventList.appendChild(listItem);
        }
      }
    }
  });
}

function updateBirthdays() {
  getAPI("/birthdays", function (names) {
    var bdayList = document.getElementById("birthdays");
    bdayList.innerHTML = "";

    for (var i = 0; i < names.length; i++) {
      var listItem = document.createElement("LI");
      listItem.innerHTML = names[i];
      bdayList.appendChild(listItem);
    }
  });
}
