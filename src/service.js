const { getAlert, updateAlert } = require("./firestore.js");
const { sendNotification } = require("./pushover.js");
const { getAllVehicles } = require("./hyundai.js");

async function run() {
  // Get alert configuration
  let alert = await getAlert();

  // Get all vehicles
  const allVehicles = await getAllVehicles(alert.zip, alert.radius);

  // Remove unwanted vehicles
  const preferredVehicles = allVehicles.filter((vehicle) => {
    return isPreferredVehicle(vehicle, alert);
  });

  // Find only new vehicles
  const newVehicles = preferredVehicles.filter((vehicle) => {
    return isNewVehicle(vehicle, alert.trackedVins);
  });

  // Alert for each new vehicle
  for (let vehicle of newVehicles) {
    const message = `Ioniq 5: ${vehicle.trim}, ${vehicle.driveTrain}, ${vehicle.exteriorColor} at ${vehicle.dealer} for ${vehicle.price}`;
    await sendNotification(alert.pushoverToken, alert.pushoverUser, message);
  }

  // Update tracked vehicles
  let trackedVins = preferredVehicles.map((vehicle) => vehicle.vin);
  alert.trackedVins = trackedVins;
  await updateAlert(alert);
}

function isNewVehicle(vehicle, existingVins) {
  return !existingVins.includes(vehicle.vin);
}

function isPreferredVehicle(vehicle, preferences) {
  if (!preferences.trims.includes(vehicle.trim)) return false;
  if (!preferences.driveTrains.includes(vehicle.driveTrain)) return false;
  if (!preferences.exteriorColors.includes(vehicle.exteriorColor)) return false;
  return true;
}

module.exports = {
  run,
};
