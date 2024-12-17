const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const User = require("../models/user");
const NAMESPACE = "User Controller";

const getServicesByUserId = async (req, res) => {
  try {
    logging.info(NAMESPACE, "getServicesByUserId Method");
    const userId = req.params.userId;
    const services = await User.getServicesByUserId(userId);
    return sendResponse(res, "GET_SERVICES_BY_USER_ID", 200, {
      data: { services },
    });
  } catch (error) {
    return sendResponse(res, "GET_SERVICES_BY_USER_ID", 500, {
      data: error,
    });
  }
};

module.exports = {
  getServicesByUserId,
};
