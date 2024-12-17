const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Reservation = require("../models/Reservation");
const NAMESPACE = "Reservation Controller";

const occupiedDays = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getOccupiedDays Method");
    const { storeId, serviceId } = req.params;
    const days = await Reservation.getOccupiedDays({ storeId, serviceId });
    return sendResponse(res, "GET_OCCUPIED_DAYS", 200, {
      data: { days },
    });
  } catch (error) {
    logging.error(NAMESPACE, "Error in getOccupiedDays", error);
    return sendResponse(res, "GET_OCCUPIED_DAYS_ERROR", 500, { data: error });
  }
};

const create = async (req, res) => {
  try {
    logging.info(NAMESPACE, "create Method");
    const { userId, storeId, serviceId, date, time, status } = req.body;
    const reservation = new Reservation({
      userId: parseInt(userId),
      storeId,
      serviceId,
      date: formatToYYYYMMDD(new Date(date)),
      time,
      status,
    });
    const reservationCreated = await reservation.create();
    return sendResponse(res, "CREATE_RESERVATION", 200, {
      data: { reservationCreated },
    });
  } catch (error) {
    logging.error(NAMESPACE, "Error in create", error);
    return sendResponse(res, "CREATE_RESERVATION_ERROR", 500, { data: error });
  }
};

function formatToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

module.exports = {
  occupiedDays,
  create,
};
