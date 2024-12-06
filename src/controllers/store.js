const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const Reservation = require("../models/reservation");
const Store = require("../models/Store");
const City = require("../models/city");
const Service = require("../models/service");
const NAMESPACE = "Store Controller";

// Crear turno
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
    console.error(error);
    return sendResponse(res, "CREATE_RESERVATION_ERROR", 500, { data: error });
  }
};

// Eliminar turno
const deleteReservation = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Delete Reservation");
    const { reservationId } = req.params;

    const deleted = await Reservation.delete(reservationId);

    if (!deleted) {
      return sendResponse(res, "RESERVATION_NOT_FOUND", 404);
    }

    return sendResponse(res, "RESERVATION_DELETED", 200);
  } catch (error) {
    console.error(error);
    return sendResponse(res, "DELETE_RESERVATION_ERROR", 500, { data: error });
  }
};

// Editar turno
const updateReservation = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Update Reservation");
    const { reservationId, date, time, status } = req.body;

    const updated = await Reservation.update({
      reservationId,
      date,
      time,
      status,
    });

    if (!updated) {
      return sendResponse(res, "RESERVATION_NOT_FOUND", 404);
    }

    return sendResponse(res, "RESERVATION_UPDATED", 200, { data: updated });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "UPDATE_RESERVATION_ERROR", 500, { data: error });
  }
};

// Cancelar turno
const cancelReservation = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Cancel Reservation");
    const { reservationId } = req.params;

    const updated = await Reservation.updateStatus(reservationId, "CANCELLED");

    if (!updated) {
      return sendResponse(res, "RESERVATION_NOT_FOUND", 404);
    }

    return sendResponse(res, "RESERVATION_CANCELLED", 200);
  } catch (error) {
    console.error(error);
    return sendResponse(res, "CANCEL_RESERVATION_ERROR", 500, { data: error });
  }
};

// Obtener todas las tiendas por ID
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
    console.error(error);
    return sendResponse(res, "GET_SHOP_ERROR", 500, { data: error });
  }
};

// Actualizar información de la tienda
const updateShopData = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Update Shop Data");
    const { shopId, name, address, rating } = req.body;

    const updated = await Store.update({
      shopId,
      name,
      address,
      rating,
    });

    if (!updated) {
      return sendResponse(res, "SHOP_NOT_FOUND", 404);
    }

    return sendResponse(res, "SHOP_UPDATED", 200);
  } catch (error) {
    console.error(error);
    return sendResponse(res, "UPDATE_SHOP_ERROR", 500, { data: error });
  }
};

//NUEVOS
// Obtener todas las tiendas en una ciudad
const getStoreByCityId = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get Store by city");
    const { cityId } = req.params;
    const stores = await Store.getByCityId(cityId);
    return sendResponse(res, "STORE_FOUND", 200, { data: stores });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_STORE_ERROR", 500, { data: error });
  }
};

const getAllStores = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get All Stores");

    const stores = await Store.getByCity();

    return sendResponse(res, "STORE_FOUND", 200, { data: stores });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GETALL_STORE_ERROR", 500, { data: error });
  }
};

module.exports = {
  createReservation,
  deleteReservation,
  updateReservation,
  cancelReservation,
  getShopById,
  updateShopData,
  getStoreByCityId,
  getAllStores,
};
