// Enable console log statements in this file
/*eslint no-console:0*/

const util = require("util");
const child_process = require("child_process");
const exec = util.promisify(child_process.exec);

/**
 * Executes a command then prints STDOUT and STDERR.
 * Any command that errors will cause the process to exit with error code 1.
 * @param {*} command
 * @param {*} cwd
 */
const executeCommand = async (command, cwd = null) => {
  console.log(`Executing: ${command} in ${cwd || "."}`);
  try {
    const { stdout, stderr } = await exec(command, { cwd });
    console.log(`Finished: ${command} in ${cwd || "."}`);
    console.log("STDOUT:");
    console.log(stdout || "None");
    console.log("STDERR:");
    console.log(stderr || "None");
    return { error: null, stdout, stderr };
  } catch (error) {
    console.log(`Error Executing: ${command} in ${cwd || "."}`);
    console.log("STDOUT:");
    console.log(error.stdout || "None");
    console.log("STDERR:");
    console.log(error.stderr || "None");
    return { error, stdout: error.stdout, stderr: error.stderr };
  }
};

const updateAll = async () => {
  try {
    let error = null;
    ({ error } = await executeCommand("git pull", __dirname));
    if (error) return new Error(error);
    ({ error } = await executeCommand("yarn install", `${__dirname}/..`));
    if (error) return new Error(error);
    ({ error } = await executeCommand("docker-compose pull", __dirname));
    if (error) return new Error(error);
    ({ error } = await executeCommand("docker-compose up -d", __dirname));
    if (error) return new Error(error);
    return null;
  } catch (err) {
    return err;
  }
};

const reboot = () => {
  executeCommand("reboot");
};

const hasUpdates = async () => false;

module.exports = { updateAll, hasUpdates, reboot };
