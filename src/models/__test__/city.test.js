const { expect } = require("chai");
const sinon = require("sinon");
const dbInstance = require("../../db");
const City = require("../City");

describe("City Model", () => {
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub(dbInstance, "query");
  });

  afterEach(() => {
    sinon.restore();
  });

  const mockCity = {
    name: "Rosario",
    region: "Santa Fe",
    country: "Argentina",
    latitude: -32.95,
    longitude: -60.66,
  };

  describe("create", () => {
    it("should insert a city into the database and return the result", async () => {
      const mockResult = { insertId: 1 };

      queryStub.resolves(mockResult);

      const city = new City(mockCity);
      const result = await city.create();

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("INSERT INTO City");
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        mockCity.name,
        mockCity.region,
        mockCity.country,
      ]);
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      const city = new City(mockCity);
      try {
        await city.create();
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getById", () => {
    it("should fetch a city by its ID", async () => {
      const cityId = 1;
      const mockRow = {
        id: 1,
        name: "Rosario",
        region: "Santa Fe",
        country: "Argentina",
        latitude: -32.95,
        longitude: -60.66,
      };

      queryStub.resolves([mockRow]);

      const result = await City.getById(cityId);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "SELECT * FROM City WHERE id"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([cityId]);
      expect(result).to.deep.equal(mockRow);
    });

    it("should throw an error if the database query fails", async () => {
      const cityId = 1;
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await City.getById(cityId);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getByName", () => {
    it("should fetch a city by its name", async () => {
      const cityName = "Rosario";
      const mockRow = {
        id: 1,
        name: "Rosario",
        region: "Santa Fe",
        country: "Argentina",
      };

      queryStub.resolves([mockRow]);

      const result = await City.getByName(cityName);

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include(
        "SELECT * FROM city WHERE name"
      );
      expect(queryStub.firstCall.args[1]).to.deep.equal([cityName]);
      expect(result).to.deep.equal(mockRow);
    });

    it("should throw an error if the database query fails", async () => {
      const cityName = "Rosario";
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await City.getByName(cityName);
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe("getAll", () => {
    it("should fetch all cities", async () => {
      const mockRows = [
        {
          id: 1,
          name: "Rosario",
          region: "Santa Fe",
          country: "Argentina",
          latitude: -32.95,
          longitude: -60.66,
        },
        {
          id: 2,
          name: "Buenos Aires",
          region: "Buenos Aires",
          country: "Argentina",
        },
      ];

      queryStub.resolves(mockRows);

      const result = await City.getAll();

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("SELECT * FROM City");
      expect(result).to.deep.equal(mockRows);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      try {
        await City.getAll();
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
});
