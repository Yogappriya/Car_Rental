const { rental } = require("../../models/rental");
const { car } = require("../../models/cars");
const mongoose = require("mongoose");
const { user } = require("../../models/user");
let server;
const req = require("supertest");

describe("/api/returns", () => {
  let customerId;
  let carId;
  let r;
  let c;
  let token;
  const exec = async () => {
    return await req(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, carId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = new user().generateAuthToken();
    customerId = mongoose.Types.ObjectId();

    c = new car({
      name: "toyota",
      numberAvailable: 0,
      dailyRentalRate: 2,
      model: { name: "model1" },
      carNumber: "12345"
    });
    await c.save();

    carId = c._id;

    r = new rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: 12345
      },
      car: {
        _id: carId,
        name: "12345",
        dailyRentalRate: 2
      },
      endDate: null
    });
    await r.save();
  });

  afterEach(async () => {
    await rental.deleteMany({});
    await car.deleteMany({});
    await server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    carId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental is found for this cust/movie", async () => {
    await rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental already processed", async () => {
    r.endDate = Date.now();
    await r.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if valid req", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the return date", async () => {
    const res = await exec();

    const rent = await rental.findById(r._id);
    const diff = new Date() - rent.endDate;
    expect(diff).toBeLessThan(120 * 1000);
  });

  it("should calculate the rental fee", async () => {
    r.startDate = new Date("2019-2-17");
    await r.save();

    const res = await exec();

    const rentalInDb = await rental.findById(r._id);
    var rent = parseInt(
      (new Date() - rentalInDb.startDate) / (1000 * 60 * 60 * 24)
    );
    rent = rent * rentalInDb.car.dailyRentalRate;

    expect(rentalInDb.rentFee).toBe(rent);
  });

  it("should increase the stock", async () => {
    const res = await exec();

    const carInDb = await car.findById(carId);
    expect(carInDb.numberAvailable).toBe(1);
  });

  it("should return the rental", async () => {
    const res = await exec();

    const rent = await rental.findById(r._id);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(["endDate", "customer", "car", "rentFee"])
    );
  });
});
