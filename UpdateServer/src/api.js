"use strict";
const status = require("http-status");

module.exports = (app, options) => {
  const updater = options.updater;

  app.get("/updates", (req, res, next) => {
    updater
      .hasUpdates()
      .then(updatesAvailable => {
        res.status(status.OK).json({ updatesAvailable });
      })
      .catch(next);
  });

  app.post("/update/all", (req, res, next) => {
    updater
      .updateAll()
      .then(({ error, stdout, stderr }) => {
        res.status(status.OK).json({ error, stdout, stderr });
      })
      .catch(next);
  });

  app.post("/reboot", (req, res, next) => {
    res.send("Rebooting...", status.OK);
    updater.reboot().catch(next);
  });
};
