require("dotenv").config();

const POSTGRES_USER = process.env.USER;
const POSTGRES_PASSWORD = process.env.PASSWORD;
const POSTGRES_DBNAME = process.env.DATABASE;
const POSTGRES_HOST = process.env.HOST;

const POSTGRES = {
  host: POSTGRES_HOST,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  dbName: POSTGRES_DBNAME,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const PORT = process.env.PORT || 3002;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER
const SERVER_TOKEN_SECRET =
  process.env.SERVER_TOKEN_SECRET

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
};

const config = {
  postgres: POSTGRES,
  server: SERVER,
};

module.exports = config;
