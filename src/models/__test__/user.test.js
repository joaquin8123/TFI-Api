const { expect } = require("chai");
const sinon = require("sinon");
const dbInstance = require("../../db");
const User = require("../User");

describe("User Model", () => {
  let queryStub;

  const mockUserId = 1;

  const mockServices = [
    {
      serviceId: 1,
      storeName: "Super Store",
      serviceName: "Car Wash",
      servicePrice: 50,
      date: "2024-12-20",
      status: "completed",
      rating: 5,
      store_id: 2,
    },
    {
      serviceId: 2,
      storeName: "Quick Fix",
      serviceName: "Oil Change",
      servicePrice: 80,
      date: "2024-12-21",
      status: "pending",
      rating: null,
      store_id: 3,
    },
  ];

  beforeEach(() => {
    queryStub = sinon.stub(dbInstance, "query");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getServicesByUserId", () => {
    it("should fetch services associated with the given user ID", async () => {
      queryStub.resolves(mockServices);

      const result = await User.getServicesByUserId(mockUserId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("SELECT");
      expect(queryStub.firstCall.args[1]).to.deep.equal([mockUserId]);
      expect(result).to.deep.equal(mockServices);
    });

    it("should return an empty array if the user has no services", async () => {
      queryStub.resolves([]);

      const result = await User.getServicesByUserId(mockUserId);

      expect(queryStub.calledOnce).to.be.true;
      expect(result).to.deep.equal([]);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");
      queryStub.rejects(mockError);

      try {
        await User.getServicesByUserId(mockUserId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
});
