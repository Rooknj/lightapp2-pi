"use strict";
const service = require("./service");
const updater = require("./updater");

// Enable console log statements in this file
/*eslint no-console:0*/

// verbose logging when we are starting the server
console.log("--- Update Service ---");

// log unhandled execpetions
process.on("uncaughtException", err => {
  console.error("Unhandled Exception", err);
});
process.on("uncaughtRejection", err => {
  console.error("Unhandled Rejection", err);
});

// Start the service
console.log("Starting Service");
const rabbitSettings = {
  protocol: "amqp",
  hostname: "localhost",
  port: 5672,
  username: "guest",
  password: "guest",
  locale: "en_US",
  frameMax: 0,
  heartbeat: 0,
  vhost: "/"
};

const amqp = require("amqplib");
service.start({ amqp, amqpSettings: rabbitSettings, updater }).then(() => {
  console.log("Service Started");
});
