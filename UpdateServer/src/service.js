const createService = async (mediator, updater) => {
  const UPDATE_HUB = "updateHub";
  const REBOOT_HUB = "rebootHub";

  mediator.onRpcMessage(
    UPDATE_HUB,
    async () => {
      const error = await updater.updateAll();
      if (error) {
        return { error: error.message, data: null };
      }
      return { error: null, data: "Successfully Updated" };
    },
    { remote: true }
  );
  mediator.onRpcMessage(
    REBOOT_HUB,
    () => {
      setTimeout(() => {
        updater.reboot();
      }, 1000);
      return { data: "Rebooting in 1 second...", error: null };
    },
    { remote: true }
  );
};

module.exports = Object.assign({}, { createService });
