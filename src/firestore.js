const { Firestore } = require("@google-cloud/firestore");

const ALERT_COLLECTION_NAME = "alerts";
const firestore = new Firestore();

async function getAlert() {
  const doc = await firestore
    .doc(`${ALERT_COLLECTION_NAME}/zxNORmpz1D9lLL8Bax8Q`)
    .get();
  return doc.data();
}

async function updateAlert(payload) {
  const doc = firestore.doc(`${ALERT_COLLECTION_NAME}/zxNORmpz1D9lLL8Bax8Q`);
  await doc.set(payload);
}

module.exports = {
  getAlert,
  updateAlert,
};
