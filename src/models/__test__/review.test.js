const { expect } = require("chai");
const sinon = require("sinon");
const dbInstance = require("../../db");
const Review = require("../Review");

describe("Review Model", () => {
  let queryStub;

  const mockReview = {
    userId: 1,
    storeId: 2,
    serviceId: 3,
    rating: 5,
    comment: "Excellent service!",
    date: "2024-12-20",
  };

  beforeEach(() => {
    queryStub = sinon.stub(dbInstance, "query");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should insert a review into the database and return the result", async () => {
      const mockResult = { insertId: 1 };

      queryStub.resolves(mockResult);

      const review = new Review(mockReview);
      const result = await review.create();

      expect(queryStub.calledOnce).to.be.true;
      expect(queryStub.firstCall.args[0]).to.include("INSERT INTO review");
      expect(queryStub.firstCall.args[1]).to.deep.equal([
        mockReview.userId,
        mockReview.storeId,
        mockReview.serviceId,
        mockReview.rating,
        mockReview.comment,
        mockReview.date,
      ]);
      expect(result).to.equal(mockResult);
    });

    it("should throw an error if the database query fails", async () => {
      const mockError = new Error("Database error");

      queryStub.rejects(mockError);

      const review = new Review(mockReview);
      try {
        await review.create();
        throw new Error("Test should have thrown an error");
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });
});
