const logger = require("./logger.js");
const { getAlert, updateAlert } = require("./firestore.js");
const { sendNotification } = require("./pushover.js");
const { getAllVehicles } = require("./hyundai.js");

async function run() {
  // Get alert configuration
  let alert = await getAlert();

  // Get all vehicles
  logger.info(`Fetching all vehicles for alert configuration: ${alert.id}`);
  const allVehicles = await getAllVehicles(alert.zip, alert.radius);

  // Remove unwanted vehicles
  const preferredVehicles = allVehicles.filter((vehicle) => {
    return isPreferredVehicle(vehicle, alert);
  });

  // Find new (untracked) vehicles
  const newVehicles = preferredVehicles.filter((vehicle) => {
    return isNewVehicle(vehicle, alert.trackedVins);
  });
  logger.info(
    `Discovered ${newVehicles.length} new vehicles for alert configuration: ${alert.id}`
  );

  // Alert for each new vehicle
  for (let vehicle of newVehicles) {
    const message = `NEW Ioniq 5: ${vehicle.trim}, ${vehicle.driveTrain}, ${vehicle.exteriorColor} at ${vehicle.dealer} for ${vehicle.price}`;
    await sendNotification(alert.pushoverToken, alert.pushoverUser, message);
  }

  // Find lost (sold) vehicles
  const lostVehicleVins = alert.trackedVins.filter((vin) => {
    return !preferredVehicles.find((vehicle) => {
      return vehicle.vin === vin;
    });
  });

  // Alert for each lost vehicle
  for (let vin of lostVehicleVins) {
    const message = `LOST Ioniq 5: ${vin}`;
    await sendNotification(alert.pushoverToken, alert.pushoverUser, message);
  }

  // Update tracked vehicles
  logger.info(`Updating tracked VINs for alert configuration: ${alert.id}`);
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
