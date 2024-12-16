const Person = require("./Person");
const db = require("../db");

class User extends Person {
  constructor(userData) {
    super(userData);
    this.role = "USER";
  }

  static async getServicesByUserId(userId) {
    const sql = `SELECT 
    service.id AS serviceId,
    store.name AS storeName,
    service.name AS serviceName, 
    service.price AS servicePrice,
    reservation.date,
    reservation.status,
    review.rating,
    reservation.store_id
FROM 
    reservation
    JOIN store ON store.id = reservation.store_id
    JOIN service ON reservation.service_id = service.id
    LEFT JOIN review 
        ON review.service_id = service.id 
        AND review.user_id = reservation.user_id
        AND review.store_id = reservation.store_id
WHERE 
    reservation.user_id = ?;`;
    const rows = await db.query(sql, [userId]);
    return rows;
  }
}

module.exports = User;
