const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");
const City = require("../models/city");
const NAMESPACE = "City Controller";

const getCityByName = async (req, res) => {
  try {
    logging.info(NAMESPACE, "Get City by name");
    const { name } = req.params;
    const city = await City.getByName(name);
    return sendResponse(res, "CITY_FOUND", 200, { data: city });
  } catch (error) {
    console.error(error);
    return sendResponse(res, "GET_STORE_ERROR", 500, { data: error });
  }
};

module.exports = {
  getCityByName,
};
