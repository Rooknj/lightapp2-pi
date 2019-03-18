"use strict";

const spawn = require("cross-spawn");
const spawnArgs = require("spawn-args");
const { delimiter } = require("path");
const pathResolve = require("path").resolve;

process.env.NODE_ENV = "development";

// Crash on unhandled rejections
process.on("unhandledRejection", err => {
  throw err;
});

// Start Nodemon with cross-spawn
const args = spawnArgs("nodemon", { removequotes: "always" });
spawn.sync(args.shift(), args, {
  stdio: ["inherit", "inherit", "inherit"],
  cwd: process.cwd(),
  env: Object.assign({}, process.env, {
    PATH:
      process.env.PATH +
      delimiter +
      pathResolve(process.cwd(), "node_modules", ".bin")
  })
});
