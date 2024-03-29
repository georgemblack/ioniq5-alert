const logger = require("./logger.js");

const INVENTORY_ENDPOINT =
  "https://www.hyundaiusa.com/var/hyundai/services/inventory/vehicleList.json";
const INVENTORY_REFERER_HEADER =
  "https://www.hyundaiusa.com/us/en/inventory-search/vehicles-list?model=Ioniq%205&year=2022";

const exteriorColorCodes = {
  SAW: "Atlas White",
  C5G: "Cyber Gray",
  T5R: "Shooting Star",
  M9U: "Digital Teal",
  MZH: "Phantom Black",
  U3P: "Lucid Blue",
};

const driveTrainCodes = {
  "ALL WHEEL DRIVE": "AWD",
  "REAR WHEEL DRIVE": "RWD",
};

/**
 * Fetch all vehicles from Hyundai inventory API.
 * Return only relevant details of each vehicle.
 */
async function getAllVehicles(zip, radius) {
  let vehicles = [];

  const url =
    INVENTORY_ENDPOINT +
    "?" +
    new URLSearchParams({
      zip: zip,
      radius: radius,
      year: "2022",
      model: "Ioniq-5",
    });
  const options = {
    method: "GET",
    headers: {
      Referer: INVENTORY_REFERER_HEADER,
    },
  };

  let response = await fetch(url, options);
  let responseBody = await response.json();

  if (response.status !== 200) {
    logger.error(
      `Failed to fetch vehicles from inventory API, received status: ${response.status}`
    );
    return [];
  }

  for (let dataGroup of responseBody.data) {
    if (dataGroup.dealerInfo) {
      for (let dealer of dataGroup.dealerInfo) {
        if (dealer.vehicles) {
          for (let vehicle of dealer.vehicles) {
            vehicles.push({
              vin: vehicle.vin,
              dealer: dealer.dealerNm,
              trim: vehicle.trimDesc,
              price: vehicle.price,
              exteriorColor: getExteriorColor(vehicle.exteriorColorCd),
              driveTrain: getDriveTrain(vehicle.drivetrainDesc),
            });
          }
        }
      }
    }
  }

  return vehicles;
}

function getExteriorColor(colorCode) {
  if (colorCode in exteriorColorCodes) {
    return exteriorColorCodes[colorCode];
  }
  return "Unknown";
}

function getDriveTrain(driveTrainCode) {
  if (driveTrainCode in driveTrainCodes) {
    return driveTrainCodes[driveTrainCode];
  }
  return "Unknown";
}

module.exports = {
  getAllVehicles,
};
