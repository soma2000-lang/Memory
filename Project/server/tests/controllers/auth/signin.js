const request = require("supertest");
const { STATUS_CODES } = require("http");


jest.mock("../../../../services/Users", () => ({
  fetchUserByEmail: jest.fn(),
}));
jest.mock("../../../../services/Subscriptions", () => ({
  fetchSubscriptionByuserid: jest.fn(),
}));

const ENDPOINT = "/api/auth/signin";

describe("Signin Controller", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "mysecret";
    process.env.CLIENT_PROXY_URL = "http://validcorsorigin.com";
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it("500 - Not allowed by CORS", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("Origin", "http://invalidcorsorigin.com");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: "Not allowed by CORS",
      statusCode: 500,
    });
  });



  

  it("422 - Password is required", async () => {
    const response = await request(app).post(ENDPOINT).send({
      email: "john@doe.com",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password is required",
      statusCode: 422,
    });
  });

  it("422 - Password must be a string", async () => {
    const response = await request(app).post(ENDPOINT).send({
      email: "john@doe.com",
      password: 5,
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password must be string",
      statusCode: 422,
    });
  });

  

  it("401 - Incorrect email or password", async () => {
    jest
      .spyOn(UserService, "fetchUserByEmail")
      .mockImplementation(() => new Users(mockUsers[1]));
    const response = await request(app).post(ENDPOINT).send({
      email: "john.doe@example.com",
      password: "password122",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: STATUS_CODES[401],
      message: "Incorrect email or password",
      statusCode: 401,
    });
  });

  it("500 - Unexpected errors", async () => {
    jest.spyOn(UserService, "fetchUserByEmail").mockImplementation(() => {
      throw new Error("Unexected error");
    });
    const response = await request(app).post(ENDPOINT).send({
      email: "johndoe@example.com",
      password: "password122",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: "Unexected error",
      statusCode: 500,
    });
  });

  it("200 - Sign In Successful", async () => {
    jest
      .spyOn(UserService, "fetchUserByEmail")
      .mockImplementation(() => new Users(mockUsers[1]));
    const response = await request(app).post(ENDPOINT).send({
      email: "johndoe@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Sign In Successful");
  });
});