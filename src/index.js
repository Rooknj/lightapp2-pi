#!/usr/bin/env node

const program = require("commander");
const { execSync } = require("child_process");

const COMPOSE_FILE =
  process.arch === "arm" ? "docker-compose.yml" : "docker-compose-x86.yml";
const COMPOSE_PATH = `${__dirname}/../compose/${COMPOSE_FILE}`;

const start = cmd => {
  console.log("Start");
  const result = execSync(
    `docker-compose -f "${COMPOSE_PATH}" up -d`
  ).toString();
  console.log(result);
};

const stop = cmd => {
  console.log("Stop");
  const result = execSync(
    `docker-compose -f "${COMPOSE_PATH}" down`
  ).toString();
  console.log(result);
};

program.command("start").action(start);
program.command("stop").action(stop);
program.parse(process.argv);

//console.log("Start");
//const result = execSync(`docker ps --format "{{.ID}},{{.Image}}"`);
//console.log(result.toString() || "NOTHING");

// npm version to bump versions

// npm view prysmalight dist-tags to check package latest on npm
// npm view prysmalight version to get current version
// Use a version file to get the version this is running at
