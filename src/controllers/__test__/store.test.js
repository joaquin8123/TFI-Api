const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const logging = require("../../config/logging");

const Reservation = {
  getByDetails: () => {},
  create: () => {},
};

const Store = {
  getById: () => {},
  getByCityId: () => {},
  getAll: () => {},
};

const Service = {
  getByStore: () => {},
  updateServiceStatus: () => {},
};

describe("Store Controller", () => {
  let req, res, loggingStub, sendResponseStub, storeController;

  beforeEach(() => {
    process.env.NODE_ENV = "test";

    req = { body: {}, params: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    loggingStub = sinon.stub(logging, "info");

    sendResponseStub = sinon
      .stub()
      .callsFake((res, msgKey, code, payload = {}) => {
        return {
          success: code >= 200 && code < 300,
          code: code,
          msg: msgKey,
          data: payload?.data,
        };
      });

    storeController = proxyquire("../store", {
      "../helpers/handleResponse": sendResponseStub,
      "../config/logging": { info: loggingStub },
      "../models/Reservation": Reservation,
      "../models/Store": Store,
      "../models/Service": Service,
    });
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.NODE_ENV;
  });

  describe("createReservation", () => {
    it("should create a reservation successfully", async () => {
      req.body = {
        userId: 1,
        storeId: 2,
        serviceId: 3,
        date: "2024-12-20",
        time: 10,
      };

      const newReservation = { id: 1 };
      const getByDetailsStub = sinon
        .stub(Reservation, "getByDetails")
        .resolves(null);
      const createStub = sinon
        .stub(Reservation, "create")
        .resolves(newReservation);

      const result = await storeController.createReservation(req, res);

      expect(result).to.deep.equal({
        success: true,
        code: 201,
        msg: "RESERVATION_CREATED",
        data: { id: 1 },
      });
    });

    it("should return a conflict if the reservation already exists", async () => {
      req.body = {
        userId: 1,
        storeId: 2,
        serviceId: 3,
        date: "2024-12-20",
        time: 10,
      };

      sinon.stub(Reservation, "getByDetails").resolves({ id: 1 });

      const result = await storeController.createReservation(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 409,
        msg: "RESERVATION_ALREADY_EXISTS",
        data: undefined,
      });
    });

    it("should handle errors during reservation creation", async () => {
      const error = new Error("Database error");
      sinon.stub(Reservation, "getByDetails").rejects(error);

      const result = await storeController.createReservation(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 500,
        msg: "CREATE_RESERVATION_ERROR",
        data: error,
      });
    });
  });

  describe("getShopById", () => {
    it("should fetch a shop by ID successfully", async () => {
      const mockShop = { id: 1, name: "Test Shop" };
      req.params.shopId = 1;

      sinon.stub(Store, "getById").resolves(mockShop);

      const result = await storeController.getShopById(req, res);

      expect(result).to.deep.equal({
        success: true,
        code: 200,
        msg: "SHOP_FOUND",
        data: mockShop,
      });
    });

    it("should return a 404 if the shop is not found", async () => {
      req.params.shopId = 1;

      sinon.stub(Store, "getById").resolves(null);

      const result = await storeController.getShopById(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 404,
        msg: "SHOP_NOT_FOUND",
        data: undefined,
      });
    });

    it("should handle errors during shop retrieval", async () => {
      req.params.shopId = 1;
      const error = new Error("Database error");

      sinon.stub(Store, "getById").rejects(error);

      const result = await storeController.getShopById(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 500,
        msg: "GET_SHOP_ERROR",
        data: error,
      });
    });
  });

  describe("getStoreByCityId", () => {
    it("should fetch stores by city ID successfully", async () => {
      const mockStores = [{ id: 1, name: "Test Store" }];
      req.params.cityId = 1;

      sinon.stub(Store, "getByCityId").resolves(mockStores);

      const result = await storeController.getStoreByCityId(req, res);

      expect(result).to.deep.equal({
        success: true,
        code: 200,
        msg: "STORE_FOUND",
        data: mockStores,
      });
    });

    it("should handle errors during store retrieval by city", async () => {
      req.params.cityId = 1;
      const error = new Error("Database error");

      sinon.stub(Store, "getByCityId").rejects(error);

      const result = await storeController.getStoreByCityId(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 500,
        msg: "GET_STORE_ERROR",
        data: error,
      });
    });
  });

  describe("getServicesByStoreId", () => {
    it("should fetch services by store ID successfully", async () => {
      const mockServices = [{ id: 1, name: "Test Service" }];
      req.params.storeId = 1;

      sinon.stub(Service, "getByStore").resolves(mockServices);

      const result = await storeController.getServicesByStoreId(req, res);

      expect(result).to.deep.equal({
        success: true,
        code: 200,
        msg: "SERVICES_FOUND",
        data: mockServices,
      });
    });

    it("should handle errors during service retrieval", async () => {
      req.params.storeId = 1;
      const error = new Error("Database error");

      sinon.stub(Service, "getByStore").rejects(error);

      const result = await storeController.getServicesByStoreId(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 500,
        msg: "GET_SERVICES_ERROR",
        data: error,
      });
    });
  });

  describe("updateServiceStatus", () => {
    it("should update service status successfully", async () => {
      req.body = { reservationId: 1, status: "COMPLETED" };
      const updateResult = { affectedRows: 1 };

      sinon.stub(Service, "updateServiceStatus").resolves(updateResult);

      const result = await storeController.updateServiceStatus(req, res);

      expect(result).to.deep.equal({
        success: true,
        code: 200,
        msg: "SERVICE_STATUS_UPDATED",
        data: updateResult,
      });
    });

    it("should handle errors during service status update", async () => {
      req.body = { reservationId: 1, status: "COMPLETED" };
      const error = new Error("Database error");

      sinon.stub(Service, "updateServiceStatus").rejects(error);

      const result = await storeController.updateServiceStatus(req, res);

      expect(result).to.deep.equal({
        success: false,
        code: 500,
        msg: "UPDATE_SERVICE_STATUS_ERROR",
        data: error,
      });
    });
  });
});
