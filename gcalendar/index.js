require("dotenv").config();
const fs = require("fs").promises;
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH2_ID,
    process.env.OAUTH2_SECRET,
    process.env.OAUTH2_REDIRECT
  );

  return fs.readFile(TOKEN_PATH).then((token) => {
    oAuth2Client.setCredentials(JSON.parse(token));
    return callback(oAuth2Client);
  });
}

function getWeekPlanning(auth) {
  const days = 4;

  const startDate = new Date();
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);

  const calendarIDs = [
    "primary",
    "974bgt9jqak5flg2bp4eudlrsk@group.calendar.google.com", // Socail
    "ufekt82rmrm0npqsc17aassm4s@group.calendar.google.com", // Study
    "p276lnoanj7d52mercp7ipu6to@group.calendar.google.com", // Work
    "dkqsotif43elct1al1mbla97lm85ausm@import.calendar.google.com", // Study schedule
  ];
  const calendar = google.calendar({ version: "v3", auth });

  const calls = calendarIDs.map((cid) => {
    return calendar.events
      .list({
        calendarId: cid,
        orderBy: "startTime",
        singleEvents: true,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
      })
      .then(({ data }) =>
        data.items
          .filter((event) => event.start.dateTime)
          .map((event) => {
            const eventDate = new Date(event.start.dateTime);
            const timeslot = Math.max(
              Math.floor(eventDate.getHours() / 4) - 2,
              0
            );

            return {
              summary: event.summary,
              day: eventDate.getDate() - startDate.getDate(),
              timeslot: timeslot,
            };
          })
      );
  });

  return Promise.all(calls).then((events) => {
    const allEvents = [].concat.apply([], events);

    // group events by timeslot and by increasing day
    return [...Array(4).keys()].map((timeslot) =>
      [...Array(4).keys()].map((daynum) =>
        allEvents
          .filter((e) => e.day === daynum)
          .filter((e) => e.timeslot === timeslot)
      )
    );
  });
}

function getBirthdays(auth) {
  const calendar = google.calendar({ version: "v3", auth });

  const startDate = new Date();
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);

  return calendar.events
    .list({
      calendarId: "8sko5ibdrcvtl7ha4979h6jm0s@group.calendar.google.com",
      orderBy: "startTime",
      singleEvents: true,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
    })
    .then(({ data }) => data.items.map((event) => event.summary.substring(2)));
}

module.exports.getWeekPlanning = () => authorize(getWeekPlanning);
module.exports.getBirthdays = () => authorize(getBirthdays);
