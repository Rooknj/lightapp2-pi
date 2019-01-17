"use strict";
const express = require("express");
const helmet = require("helmet");
const api = require("./api");

const start = options => {
  return new Promise((resolve, reject) => {
    // we need to verify if we have a server port
    if (!options.updater) {
      reject(new Error("The server must be started with an updater"));
    }
    if (!options.port) {
      reject(new Error("The server must be started with an available port"));
    }
    // let's init a express app, and add some middlewares
    const app = express();
    app.use(helmet());

    //eslint-disable-next-line no-unused-vars
    app.use((err, req, res, _) => {
      reject(new Error("Something went wrong!, err:" + err));
      res.status(500).send("Something went wrong!");
    });

    // we add our API's to the express app
    api(app, options);

    // finally we start the server, and return the newly created server
    const server = app.listen(options.port, () => resolve(server));
  });
};

module.exports = Object.assign({}, { start });
