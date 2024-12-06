const db = require("../db");

class Reservation {
  constructor({ userId, storeId, serviceId, date, time, status }) {
    this.userId = userId;
    this.storeId = storeId;
    this.serviceId = serviceId;
    this.date = date;
    this.time = time;
    this.status = status;
  }

  async create() {
    try {
      const sql = `
        INSERT INTO Reservation (user_id, store_id, service_id, date, time, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [
        this.userId,
        this.storeId,
        this.serviceId,
        this.date,
        this.time,
        this.status,
      ];
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  }

  static async getByDetails({ userId, storeId, serviceId, date, time }) {
    try {
      const sql = `
        SELECT * FROM Reservation
        WHERE user_id = ? AND store_id = ? AND service_id = ? AND date = ? AND time = ?
      `;
      const values = [userId, storeId, serviceId, date, time];
      const rows = await db.query(sql, values);
      return rows[0];
    } catch (error) {
      console.error("Error fetching reservation:", error);
      throw error;
    }
  }

  static async delete(reservationId) {
    try {
      const sql = `DELETE FROM Reservation WHERE id = ?`;
      const result = await db.query(sql, [reservationId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      throw error;
    }
  }

  static async update({ reservationId, date, time, status }) {
    try {
      const fields = [];
      const values = [];

      if (date) {
        fields.push("date = ?");
        values.push(date);
      }
      if (time) {
        fields.push("time = ?");
        values.push(time);
      }
      if (status) {
        fields.push("status = ?");
        values.push(status);
      }
      values.push(reservationId);

      const sql = `UPDATE Reservation SET ${fields.join(", ")} WHERE id = ?`;
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  }

  static async updateStatus(reservationId, status) {
    try {
      const sql = `UPDATE Reservation SET status = ? WHERE id = ?`;
      const values = [status, reservationId];
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error updating reservation status:", error);
      throw error;
    }
  }
}

module.exports = Reservation;
