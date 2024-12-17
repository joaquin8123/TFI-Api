const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Reservation = require("../models/Reservation");
const Store = require("../models/Store");
const Service = require("../models/Service");
const EventEmitter = require("../helpers/EventEmitter");
const NAMESPACE = "Store Controller";

const createReservation = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Create Reservation");
    const { userId, storeId, serviceId, date, time } = req.body;

    const existingReservation = await Reservation.getByDetails({
      userId,
      storeId,
      serviceId,
      date,
      time,
    });

    if (existingReservation) {
      return sendResponse(res, "RESERVATION_ALREADY_EXISTS", 409);
    }

    const reservation = await Reservation.create({
      userId,
      storeId,
      serviceId,
      date,
      time,
      status: "PENDING",
    });

    return sendResponse(res, "RESERVATION_CREATED", 201, { data: reservation });
  } catch (error) {
    return sendResponse(res, "CREATE_RESERVATION_ERROR", 500, { data: error });
  }
};

const getShopById = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get Shop by ID");
    const { shopId } = req.params;

    const shop = await Store.getById(shopId);

    if (!shop) {
      return sendResponse(res, "SHOP_NOT_FOUND", 404);
    }

    return sendResponse(res, "SHOP_FOUND", 200, { data: shop });
  } catch (error) {
    return sendResponse(res, "GET_SHOP_ERROR", 500, { data: error });
  }
};

const getStoreByCityId = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get Store by city");
    const { cityId } = req.params;
    const stores = await Store.getByCityId(cityId);
    return sendResponse(res, "STORE_FOUND", 200, { data: stores });
  } catch (error) {
    return sendResponse(res, "GET_STORE_ERROR", 500, { data: error });
  }
};

const getAllStores = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get All Stores");

    const stores = await Store.getByCity();

    return sendResponse(res, "STORE_FOUND", 200, { data: stores });
  } catch (error) {
    return sendResponse(res, "GETALL_STORE_ERROR", 500, { data: error });
  }
};

const getServicesByStoreId = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get Services by Store ID");
    const { storeId } = req.params;
    const services = await Service.getByStore(storeId);
    return sendResponse(res, "SERVICES_FOUND", 200, { data: services });
  } catch (error) {
    return sendResponse(res, "GET_SERVICES_ERROR", 500, { data: error });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Update Service Status");
    const { reservationId, status } = req.body;
    const updated = await Service.updateServiceStatus(reservationId, status);
    EventEmitter.emitReservationUpdated({
      type: "SERVICE_STATUS_CHANGE",
      serviceId: reservationId,
      newStatus: status,
    });
    return sendResponse(res, "SERVICE_STATUS_UPDATED", 200, { data: updated });
  } catch (error) {
    return sendResponse(res, "UPDATE_SERVICE_STATUS_ERROR", 500, {
      data: error,
    });
  }
};

module.exports = {
  createReservation,
  getShopById,
  getStoreByCityId,
  getAllStores,
  getServicesByStoreId,
  updateServiceStatus,
};
