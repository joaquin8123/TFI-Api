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
    console.error("Error:", error);
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
    console.error("Error:", error);
  }
};

function formatToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
  const day = String(date.getDate()).padStart(2, '0'); // Asegura siempre 2 dígitos
  return `${year}${month}${day}`;
}

module.exports = {
  occupiedDays,
  create,
};
