const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIO = require("socket.io");

const logging = require("./config/logging");
const config = require("./config/config");

/* Routes Import */
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const storeRoutes = require("./routes/store");
const cityRoutes = require("./routes/city");
const reservationRoutes = require("./routes/reservation");
const reviewRoutes = require("./routes/review");
const NAMESPACE = "Server";
const app = express();

app.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] => URL: [${req.url}] => IP: [${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] => URL: [${req.url}] => IP: [${req.socket.remoteAddress}] => STATUS: [${res.statusCode}]`
    );
  });

  next();
});

/* Parse the request */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Rules of our API */
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

/* Routes */

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/store", storeRoutes);
app.use("/city", cityRoutes);
app.use("/reservation", reservationRoutes);
app.use("/review", reviewRoutes);

/* Error handling */
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/* Create the server */
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

app.set("socketio", io);
io.on("connection", (socket) => {
  logging.info(NAMESPACE, `Cliente conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    logging.info(NAMESPACE, `Cliente desconectado: ${socket.id}`);
  });
});
httpServer.listen(config.server.port, () => {
  logging.info(
    NAMESPACE,
    `API [Online] => Running on: ${config.server.hostname}:${config.server.port}`
  );
  logging.info(
    NAMESPACE,
    `WebSocket URL => ws://${config.server.hostname}:${config.server.port}`
  );
});
