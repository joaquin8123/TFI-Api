const db = require("../db");

class Review {
  constructor({ userId, storeId, serviceId, rating, comment = "", date }) {
    this.userId = userId;
    this.storeId = storeId;
    this.serviceId = serviceId;
    this.rating = rating;
    this.comment = comment;
    this.date = date;
  }

  async create() {
    try {
      const sql = `
        INSERT INTO review (user_id, store_id, service_id, rating, comment, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [
        this.userId,
        this.storeId,
        this.serviceId,
        this.rating,
        this.comment,
        this.date,
      ];
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Review;
