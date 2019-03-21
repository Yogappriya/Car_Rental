const req = require("supertest");
const { user } = require("../../models/user");
const { model } = require("../../models/model");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await model.deleteMany({});
    await server.close();
  });

  let token;
  const exec = () => {
    return req(server)
      .post("/api/models")
      .set("x-auth-token", token)
      .send({ name: "model1" });
  };

  beforeEach(() => {
    token = new user().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token is provided", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid token is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
