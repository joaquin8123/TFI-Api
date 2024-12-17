class EventEmitter {
  constructor(io) {
    this.io = io;
  }

  emitReservationUpdated(reservation) {
    this.io.emit("SERVICE_STATUS_CHANGE", reservation);
  }
}

module.exports = EventEmitter;
