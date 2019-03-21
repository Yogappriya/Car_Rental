const req = require("supertest");
const { model } = require("../../models/model");
const { user } = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/models", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await model.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all models", async () => {
      await model.collection.insertMany([
        { name: "model1" },
        { name: "model2" }
      ]);
      const res = await req(server).get("/api/models");

      expect(res.body.some(m => m.name === "model1")).toBeTruthy();
      expect(res.body.some(m => m.name === "model2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return the model if valid id is passed", async () => {
      const mo = new model({ name: "model1" });
      await mo.save();

      const res = await req(server).get(`/api/models/${mo._id}`);

      expect(res.body).toHaveProperty("name", mo.name);
    });

    it("should return status 404 if no model with given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await req(server).get(`/api/models/${id}`);

      expect(res.status).toBe(404);
    });

    it("should return status 404 if invalid id is passed", async () => {
      const res = await req(server).get(`/api/models/${"1"}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await req(server)
        .post("/api/models")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new user().generateAuthToken();
      name = "model1";
    });

    it("should return if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if model is less than 5 characters", async () => {
      name = "123";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if model is more than 20 characters", async () => {
      name = new Array(21).join.call("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the model if it is valid", async () => {
      await exec();
      const m = await model.find({ name: "model1" });
      expect(m).not.toBeNull();
    });

    it("should save the model if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "model1");
    });
  });
});
