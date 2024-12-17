const { expect } = require("chai");
const sinon = require("sinon");
const dbInstance = require("../../db");
const Store = require("../Store");

describe("Store Model", () => {
  let queryStub;

  const mockStore = {
    name: "Super Store",
    address: "123 Main St",
    rating: 4.5,
    cityId: 1,
    ownerId: 1,
  };

  const mockStoreId = 1;

  const mockUpdatedStore = {
    shopId: 1,
    name: "Updated Store",
    address: "456 Elm St",
    rating: 4.8,
  };

  beforeEach(() => {
    queryStub = sinon.stub(dbInstance, "query");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should insert a store into the database and return the result", async () => {
      const mockResult = { insertId: 1 };

      queryStub.resolves(mockResult);

      const store = new Store(mockStore);
      const result = await store.create();

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("INSERT INTO Store");
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        mockStore.name,
        mockStore.address,
        mockStore.rating,
        mockStore.cityId,
        mockStore.ownerId,
      ]);
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      const store = new Store(mockStore);
      try {
        await store.create();
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getByCityId", () => {
    it("should fetch stores by city ID", async () => {
      const mockRows = [
        { id: 1, name: "Store 1", serviceId: 101 },
        { id: 2, name: "Store 2", serviceId: 102 },
      ];

      queryStub.resolves(mockRows);

      const result = await Store.getByCityId(mockStore.cityId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "SELECT Store.*, service.id AS serviceId"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([mockStore.cityId]);
      expect(result).to.deep.equal(mockRows);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Store.getByCityId(mockStore.cityId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getById", () => {
    it("should fetch a store by its ID", async () => {
      const mockRow = { id: mockStoreId, ...mockStore };

      queryStub.resolves([mockRow]);

      const result = await Store.getById(mockStoreId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "SELECT * FROM Store WHERE id"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([mockStoreId]);
      expect(result).to.deep.equal(mockRow);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Store.getById(mockStoreId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("update", () => {
    it("should update store details and return the result", async () => {
      const mockResult = { affectedRows: 1 };

      queryStub.resolves(mockResult);

      const result = await Store.update(mockUpdatedStore);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("UPDATE Store");
      expect(queryStub.firstCall.args[1]).to.include(mockUpdatedStore.name);
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await Store.update(mockUpdatedStore);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
});
