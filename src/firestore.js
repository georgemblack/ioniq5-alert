const { Firestore } = require("@google-cloud/firestore");
const logger = require("./logger.js");

const ALERT_COLLECTION_NAME = "alerts";
const firestore = new Firestore();

async function getAlert() {
  logger.info("Fetching alert configuration with ID: zxNORmpz1D9lLL8Bax8Q");
  const doc = await firestore
    .doc(`${ALERT_COLLECTION_NAME}/zxNORmpz1D9lLL8Bax8Q`)
    .get();
  return doc.data();
}

async function updateAlert(payload) {
  logger.info("Updating alert configuration with ID: zxNORmpz1D9lLL8Bax8Q");
  const doc = firestore.doc(`${ALERT_COLLECTION_NAME}/zxNORmpz1D9lLL8Bax8Q`);
  await doc.set(payload);
}

module.exports = {
  getAlert,
  updateAlert,
};
