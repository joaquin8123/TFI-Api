const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const User = require("../models/user");
const NAMESPACE = "User Controller";

const getAllUser = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getAllUser Method");
    const users = await User.getAllGroupUser();
    return sendResponse(res, "GET_USERS", 200, {
      data: { users },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
const getUserById = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getUserById Method");
    const userId = req.params.userId;
    const user = await User.getUserById(userId);
    return sendResponse(res, "GET_USER", 200, {
      data: { user },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateUser = async (req, res) => {
  try {
    logging.info(NAMESPACE, "UpdateActiveUser Method");
    await User.updateUser(req.body);
    return sendResponse(res, "UPDATE_ACTIVE_USERS", 200, {});
  } catch (error) {
    console.error("Error:", error);
  }
};

const getServicesByUserId = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getServicesByUserId Method");
    const userId = req.params.userId;
    const services = await User.getServicesByUserId(userId);
    return sendResponse(res, "GET_SERVICES_BY_USER_ID", 200, {
      data: { services },
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  getAllUser,
  updateUser,
  getUserById,
  getServicesByUserId,
};
