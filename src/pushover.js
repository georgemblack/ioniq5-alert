async function sendNotification(token, user, message) {
  const url = "https://api.pushover.net/1/messages.json";
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

  const response = await fetch(url, options);
  if (response.status !== 200) {
    console.log("Error sending notification");
  }
}

module.exports = {
  sendNotification,
};
