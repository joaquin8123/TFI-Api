const { expect } = require("chai");
const sinon = require("sinon");
const dbInstance = require("../../db");
const Reservation = require("../Reservation");

describe("Reservation Model", () => {
  let queryStub;

  const mockReservation = {
    userId: 1,
    storeId: 2,
    serviceId: 3,
    date: "2024-12-20",
    time: 10,
    status: "confirmed",
  };

  const mockUpdateData = {
    reservationId: 1,
    date: "2024-12-21",
    time: 12,
    status: "updated",
  };

  const details = {
    userId: 1,
    storeId: 2,
    serviceId: 3,
    date: "2024-12-20",
    time: 10,
  };

  beforeEach(() => {
    queryStub = sinon.stub(dbInstance, "query");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should insert a reservation into the database and return the result", async () => {
      const mockResult = { insertId: 1 };

      queryStub.resolves(mockResult);

      const reservation = new Reservation(mockReservation);
      const result = await reservation.create();

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("INSERT INTO Reservation");
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        mockReservation.userId,
        mockReservation.storeId,
        mockReservation.serviceId,
        mockReservation.date,
        mockReservation.time,
        mockReservation.status,
      ]);
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      const reservation = new Reservation(mockReservation);
      try {
        await reservation.create();
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getByDetails", () => {
    it("should fetch a reservation by its details", async () => {
      const mockRow = {
        id: 1,
        ...details,
        status: "confirmed",
      };

      queryStub.resolves([mockRow]);

      const result = await Reservation.getByDetails(details);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "SELECT * FROM Reservation"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        details.userId,
        details.storeId,
        details.serviceId,
        details.date,
        details.time,
      ]);
      expect(result).to.deep.equal(mockRow);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Reservation.getByDetails(details);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("delete", () => {
    it("should delete a reservation by its ID and return true if successful", async () => {
      const reservationId = 1;
      const mockResult = { affectedRows: 1 };

      queryStub.resolves(mockResult);

      const result = await Reservation.delete(reservationId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("DELETE FROM Reservation");
      expect(queryStub.firstCall.args[1]).to.deep.equal([reservationId]);
      expect(result).to.be.true;
    });

    it("should return false if no rows were affected", async () => {
      const reservationId = 1;
      const mockResult = { affectedRows: 0 };

      queryStub.resolves(mockResult);

      const result = await Reservation.delete(reservationId);

      expect(result).to.be.false;
    });

    it("should throw an error if the database query fails", async () => {
      const reservationId = 1;
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Reservation.delete(reservationId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("update", () => {
    it("should update a reservation's details and return the result", async () => {
      const mockResult = { affectedRows: 1 };

      queryStub.resolves(mockResult);

      const result = await Reservation.update(mockUpdateData);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("UPDATE Reservation");
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Reservation.update(mockUpdateData);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getOccupiedDays", () => {
    it("should fetch occupied days for a store and service", async () => {
      const params = { storeId: 1, serviceId: 2 };
      const mockRows = [{ date: "2024-12-20" }, { date: "2024-12-21" }];

      queryStub.resolves(mockRows);

      const result = await Reservation.getOccupiedDays(params);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("SELECT DISTINCT date");
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        params.storeId,
        params.serviceId,
      ]);
      expect(result).to.deep.equal([
        new Date("2024-12-20"),
        new Date("2024-12-21"),
      ]);
    });

    it("should throw an error if the database query fails", async () => {
      const params = { storeId: 1, serviceId: 2 };
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Reservation.getOccupiedDays(params);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
});
