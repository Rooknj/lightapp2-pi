"use strict";
const server = require("./server");
const updater = require("./updater");

// Enable console log statements in this file
/*eslint no-console:0*/

const PORT = 4002;

// verbose logging when we are starting the server
console.log("--- Update Service ---");

// log unhandled execpetions
process.on("uncaughtException", err => {
  console.error("Unhandled Exception", err);
});
process.on("uncaughtRejection", err => {
  console.error("Unhandled Rejection", err);
});

server
  .start({
    port: PORT,
    updater
  })
  .then(app => {
    console.log(`Server started succesfully, running on port: ${PORT}.`);
    app.on("close", () => {
      console.log("App Closed");
    });
  });
