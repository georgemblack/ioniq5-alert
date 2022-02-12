const logger = require("./logger.js");

const PUSHOVER_ENDPOINT = "https://api.pushover.net/1/messages.json";

/**
 * Send push notification via Pushover service.
 */
async function sendNotification(token, user, message) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      user,
      message,
    }),
  };

  const response = await fetch(PUSHOVER_ENDPOINT, options);
  if (response.status !== 200) {
    logger.error(
      `Failed to send push notification, received status: ${response.status}`
    );
    return;
  }
}

module.exports = {
  sendNotification,
};
