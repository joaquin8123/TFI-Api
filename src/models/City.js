const db = require("../db");

class City {
  constructor({ name, region, country }) {
    this.name = name;
    this.region = region;
    this.country = country;
  }

  async create() {
    try {
      const sql = `
        INSERT INTO City (name, region, country)
        VALUES (?, ?, ?)
      `;
      const values = [this.name, this.region, this.country];
      const result = await db.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error creating city:", error);
      throw error;
    }
  }

  static async getById(cityId) {
    try {
      const sql = `SELECT * FROM City WHERE id = ?`;
      const rows = await db.query(sql, [cityId]);
      return rows[0];
    } catch (error) {
      console.error("Error fetching city by ID:", error);
      throw error;
    }
  }

  static async getByName(name) {
    try {
      const sql = `SELECT * FROM city WHERE name = ?`;
      const rows = await db.query(sql, [name]);
      return rows[0];
    } catch (error) {
      console.error("Error fetching city by ID:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const sql = `SELECT * FROM City`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching all cities:", error);
      throw error;
    }
  }
}

module.exports = City;
