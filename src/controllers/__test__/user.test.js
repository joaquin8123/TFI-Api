const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const logging = require("../../config/logging");
const User = require("../../models/user");

describe("User Controller", () => {
  let req, res, userStub, sendResponseStub, loggingStub, getServicesByUserId;

  beforeEach(() => {
    process.env.NODE_ENV = "test";

    req = { params: { userId: 1 } };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    userStub = sinon.stub(User, "getServicesByUserId");
    loggingStub = sinon.stub(logging, "info");

    sendResponseStub = sinon
      .stub()
      .callsFake((res, msgKey, code, payload = {}) => {
        const data = payload ? payload?.data : undefined;
        return {
          success: code >= 200 && code < 300,
          code: code,
          msg: msgKey,
          data,
        };
      });

    const userController = proxyquire("../users", {
      "../helpers/handleResponse": sendResponseStub,
      "../config/logging": { info: loggingStub },
    });

    getServicesByUserId = userController.getServicesByUserId;
  });

  afterEach(() => {
    sinon.restore();
    delete process.env.NODE_ENV;
  });

  describe("getServicesByUserId", () => {
    it("should return services for a valid user ID", async () => {
      const mockServices = [
        {
          id: 1,
          serviceName: "Oil Change",
          date: "2024-12-20",
          status: "completed",
        },
        {
          id: 2,
          serviceName: "Tire Change",
          date: "2024-12-21",
          status: "pending",
        },
      ];

      userStub.resolves(mockServices);

      const result = await getServicesByUserId(req, res);

      expect(
        loggingStub.calledOnceWith(
          "User Controller",
          "getServicesByUserId Method"
        )
      ).to.be.true;

      expect(userStub.calledOnceWith(1)).to.be.true;

      expect(result).to.deep.equal({
        success: true,
        code: 200,
        msg: "GET_SERVICES_BY_USER_ID",
        data: { services: mockServices },
      });
    });
  });
});
