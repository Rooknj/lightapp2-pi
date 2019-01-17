"use strict";
const status = require("http-status");

module.exports = (app, options) => {
  const updater = options.updater;

  // here we get all the movies
  app.get("/updates", (req, res, next) => {
    updater
      .hasUpdates()
      .then(updatesAvailable => {
        res.status(status.OK).json({ updatesAvailable });
      })
      .catch(next);
  });

  // here we retrieve only the premieres
  app.post("/update/all", (req, res, next) => {
    updater
      .updateAll()
      .then(({ error, stdout, stderr }) => {
        res.status(status.OK).json({ error, stdout, stderr });
      })
      .catch(next);
  });

  // app.get("/movies/:id", (req, res, next) => {
  //   repo
  //     .getMovieById(req.params.id)
  //     .then(movie => {
  //       res.status(status.OK).json(movie);
  //     })
  //     .catch(next);
  // });
};
