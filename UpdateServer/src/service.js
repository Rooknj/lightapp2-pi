const Debug = require("debug").default;
const debug = Debug("service");
const { promisify } = require("util");
const asyncSetTimeout = promisify(setTimeout);

// JSON Buffer Generator
const toJsonBuffer = object => Buffer.from(JSON.stringify(object));

const connect = async ({ amqp, amqpSettings }) => {
  // Validate the input
  if (!amqp)
    return {
      error: new Error("You must provide an amqp library"),
      service: null
    };
  if (!amqpSettings)
    return {
      error: new Error("You must provide amqp connection settings"),
      service: null
    };

  // Attempt to connect to rabbitMQ until successful
  const RETRY_DELAY = 5; // Retry delay in seconds
  let attemptNumber = 0,
    connected = false;
  while (!connected) {
    try {
      // Attempt the connection
      attemptNumber += 1;
      debug(`Attempt ${attemptNumber} to connect to rabbitMQ...`);
      const connection = await amqp.connect(amqpSettings);

      // Once the server is forced to close, close the rabbitMQ connection
      process.once("SIGINT", connection.close.bind(connection));
      debug(`Connected to rabbitMQ after ${attemptNumber} attempts.`);

      // return the connection
      return connection;
    } catch (err) {
      debug(
        `Error connecting to rabbitMQ. Retrying in ${RETRY_DELAY} seconds...`
      );

      // If it fails, wait for a time before retrying
      await asyncSetTimeout(RETRY_DELAY * 1000);
    }
  }
};

const start = async ({ amqp, amqpSettings, updater }) => {
  const conn = await connect({ amqp, amqpSettings });

  // Make sure you create a single channel to reuse for things like this.
  // TODO: Figure out if it would be smart to use this channel for all consumers too
  const UPDATE_HUB_Q = "updateHub";
  const REBOOT_HUB_Q = "rebootHub";

  // Creates a consumer which listens to a specific rabbitMQ queue and sends a response to sent messages
  const createConsumer = (q, getResponse) => {
    conn.createChannel().then(ch => {
      ch.assertQueue(q).then(() => {
        //Watch incomming messages
        ch.consume(q, async msg => {
          const response = await getResponse(msg);

          //Send back to the sender (replyTo) queue and give the correlationId back
          //so we can emit the event.
          ch.sendToQueue(msg.properties.replyTo, toJsonBuffer(response), {
            correlationId: msg.properties.correlationId
          });

          //Acknowledge the job done with the message.
          ch.ack(msg);
        });
      });
    });
  };

  // updateHub
  createConsumer(UPDATE_HUB_Q, async () => {
    // update the hub
    const updateResponse = await updater.updateAll();

    // Generate a response message
    let response = { error: null, data: null };
    if (updateResponse instanceof Error) {
      response.error = updateResponse.message;
    } else {
      response.data = updateResponse;
    }
    return response;
  });

  // rebootHub
  conn.createChannel().then(ch => {
    ch.assertQueue(REBOOT_HUB_Q).then(() => {
      //Watch incomming messages
      ch.consume(REBOOT_HUB_Q, async msg => {
        const response = { error: null, data: "Initiating Reboot" };

        //Send back to the sender (replyTo) queue and give the correlationId back
        //so we can emit the event.
        ch.sendToQueue(msg.properties.replyTo, toJsonBuffer(response), {
          correlationId: msg.properties.correlationId
        });

        //Acknowledge the job done with the message.
        ch.ack(msg);

        // Start the reboot
        updater.reboot();
      });
    });
  });
};

module.exports = Object.assign({}, { start });
