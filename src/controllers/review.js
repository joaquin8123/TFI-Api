const sendResponse = require("../helpers/handleResponse");
const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { userId, storeId, serviceId, rating, comment, date } = req.body;
    const review = new Review({
      userId,
      storeId,
      serviceId,
      rating,
      comment,
      date: new Date(),
    });
    await review.create();
    return sendResponse(res, "CREATE_REVIEW", 200, { data: review });
  } catch (error) {
    return sendResponse(res, "CREATE_REVIEW_ERROR", 500, {
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
};
