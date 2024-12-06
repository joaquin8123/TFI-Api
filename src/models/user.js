const db = require("../db");

class User {
  constructor({ name, username, password, role, cityId, address }) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.cityId = cityId;
    this.active = 1;
    this.address = address;
  }

  async register() {
    //sanitizar params
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
      const sql = `SELECT u.id, username, password, role, active FROM user u  WHERE username="${username}"`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getAllGroupUser() {
    try {
      const sql = `SELECT
      u.id,
      username,
      rol.name AS rol_name,
      active,
      gr.name AS group_name
  FROM
      user u
      LEFT JOIN rol ON rol.id = u.rol_id
      LEFT JOIN \`group\` gr ON gr.id = u.group_id
  `;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async updateUser(params) {
    try {
      const updateSet = Object.keys(params)
        .filter((key) => key !== "userId")
        .map((key) => {
          const value =
            typeof params[key] === "string" ? `"${params[key]}"` : params[key];
          return `${key} = ${value}`;
        })
        .join(", ");
      const sql = `UPDATE user SET ${updateSet} WHERE id = ${params.userId};`;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const sql = `SELECT
      u.id,
      username,
      rol.name AS rol_name,
      active,
      gr.name AS group_name
  FROM
      user u
      LEFT JOIN rol ON rol.id = u.rol_id
      LEFT JOIN \`group\` gr ON gr.id = u.group_id
  WHERE 
      u.id = ${userId}
      `;
      const rows = await db.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

module.exports = User;
