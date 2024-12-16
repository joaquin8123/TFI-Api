const db = require("../db");

class Person {
  constructor({ name, username, password, cityId, address = "" }) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.cityId = cityId;
    this.active = 1;
    this.address = address;
  }

  async register() {
    try {
      const sql =
        "INSERT INTO user(name, username, password, role, city_id, active, address) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        this.name,
        this.username,
        this.password,
        this.role,
        this.cityId,
        this.active,
        this.address,
      ];
      const rows = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  static async getUser(params) {
    const { username } = params;
    try {
      const sql = `SELECT u.id, username, password, u.role, u.active, store.id AS store_id FROM user u left join store ON store.owner_id = u.id  WHERE username="${username}"`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = Person;
