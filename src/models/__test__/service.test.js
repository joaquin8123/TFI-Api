const { expect } = require("chai");
const sinon = require("sinon");
const dbInstance = require("../../db");
const Service = require("../Service");

describe("Service Model", () => {
  let queryStub;

  const mockService = {
    storeId: 1,
    name: "Car Wash",
    description: "Full car wash service",
    price: 50,
    duration: 60,
  };

  const mockServiceResult = { insertId: 1 };
  const mockServiceId = 1;

  beforeEach(() => {
    queryStub = sinon.stub(dbInstance, "query");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should insert a service into the database and return the result", async () => {
      queryStub.resolves(mockServiceResult);

      const service = new Service(mockService);
      const result = await service.create();

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("INSERT INTO Service");
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        mockService.storeId,
        mockService.name,
        mockService.description,
        mockService.price,
        mockService.duration,
      ]);
      expect(result).to.equal(mockServiceResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");
      queryStub.rejects(mockError);

      const service = new Service(mockService);
      try {
        await service.create();
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getById", () => {
    it("should fetch a service by its ID", async () => {
      const mockRow = { id: mockServiceId, ...mockService };
      queryStub.resolves([mockRow]);

      const result = await Service.getById(mockServiceId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "SELECT * FROM Service WHERE id"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([mockServiceId]);
      expect(result).to.deep.equal(mockRow);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");
      queryStub.rejects(mockError);

      try {
        await Service.getById(mockServiceId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getByStore", () => {
    it("should fetch services by store ID", async () => {
      const mockRows = [
        {
          id: 1,
          serviceName: "Car Wash",
          clientName: "John",
          servicePrice: 50,
          date: "2024-12-21",
          status: "confirmed",
        },
        {
          id: 2,
          serviceName: "Oil Change",
          clientName: "Jane",
          servicePrice: 80,
          date: "2024-12-22",
          status: "pending",
        },
      ];

      queryStub.resolves(mockRows);

      const result = await Service.getByStore(mockService.storeId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("SELECT");
      expect(queryStub.firstCall.args[1]).to.deep.equal([mockService.storeId]);
      expect(result).to.deep.equal(mockRows);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");
      queryStub.rejects(mockError);

      try {
        await Service.getByStore(mockService.storeId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("updateServiceStatus", () => {
    it("should update the status of a reservation", async () => {
      const mockResult = { affectedRows: 1 };
      const reservationId = 1;
      const status = "completed";

      queryStub.resolves(mockResult);

      const result = await Service.updateServiceStatus(reservationId, status);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "UPDATE reservation SET status"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        status,
        reservationId,
      ]);
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");
      queryStub.rejects(mockError);

      try {
        await Service.updateServiceStatus(1, "completed");
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
});
