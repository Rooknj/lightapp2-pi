"use strict";
const { createService } = require("./service");
const updater = require("./updater");
const mediatorFactory = require("./mediator/mediator");
const redis = require("redis");
const events = require("events");

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

const eventEmitter = new events.EventEmitter();

// Create a redis client
const redisClient = redis.createClient(6379, "localhost");

const mediator = mediatorFactory(eventEmitter, redisClient);

createService(mediator, updater).then(() => console.log("Service Started"));
