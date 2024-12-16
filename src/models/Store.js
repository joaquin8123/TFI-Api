const db = require("../db");

class Store {
  constructor({ name, address, rating, cityId, ownerId }) {
    this.name = name;
    this.address = address;
    this.rating = rating;
    this.cityId = cityId;
    this.ownerId = ownerId;
  }

  async create() {
    try {
      const sql = `
        INSERT INTO Store (name, address, rating, city_id, owner_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        this.name,
        this.address,
        this.rating,
        this.cityId,
        this.ownerId,
      ];
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error creating shop:", error);
      throw error;
    }
  }

  static async getByCityId(cityId) {
    try {
      const sql = `SELECT Store.*, service.id AS serviceId FROM Store JOIN Service ON Store.id = Service.store_id WHERE city_id = ? AND active=true`;
      const rows = await db.query(sql, [cityId]);
      return rows;
    } catch (error) {
      console.error("Error fetching shops by city:", error);
      throw error;
    }
  }

  static async getById(shopId) {
    try {
      const sql = `SELECT * FROM Store WHERE id = ?`;
      const rows = await db.query(sql, [shopId]);
      return rows[0];
    } catch (error) {
      console.error("Error fetching shop by ID:", error);
      throw error;
    }
  }

  static async update({ shopId, name, address, rating }) {
    try {
      const fields = [];
      const values = [];

      if (name) {
        fields.push("name = ?");
        values.push(name);
      }
      if (address) {
        fields.push("address = ?");
        values.push(address);
      }
      if (rating !== undefined) {
        fields.push("rating = ?");
        values.push(rating);
      }
      values.push(shopId);

      const sql = `UPDATE Store SET ${fields.join(", ")} WHERE id = ?`;
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error updating shop:", error);
      throw error;
    }
  }
}

module.exports = Store;
