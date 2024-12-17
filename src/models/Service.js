const db = require("../db");

class Service {
  constructor({ storeId, name, description, price, duration }) {
    this.storeId = storeId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.duration = duration;
  }

  async create() {
    try {
      const sql = `
        INSERT INTO Service (store_id, name, description, price, duration)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        this.storeId,
        this.name,
        this.description,
        this.price,
        this.duration,
      ];
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getById(serviceId) {
    try {
      const sql = `SELECT * FROM Service WHERE id = ?`;
      const rows = await db.query(sql, [serviceId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByStore(storeId) {
    try {
      const sql = `SELECT
      serv.id,
	serv.name as serviceName,
    cli.name AS clientName,
    serv.price AS servicePrice,
    reservation.date,
    reservation.status 
FROM
reservation 
JOIN service serv ON serv.id = reservation.service_id
JOIN user cli ON cli.id = reservation.user_id
WHERE reservation.store_id = ?`;
      const rows = await db.query(sql, [storeId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateServiceStatus(reservationId, status) {
    try {
      const sql = `UPDATE reservation SET status = ? WHERE id = ?`;
      const result = await db.query(sql, [status, reservationId]);
      return result;
    } catch (error) {

      throw error;
    }
  }
}

module.exports = Service;
