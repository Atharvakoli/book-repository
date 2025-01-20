const request = require("supertest");
const app = require("../index");
const { addUser } = require("../controllers/index.controller");
const { addNewUser } = require("../service/index.service");

const { User } = require("../models");
const { isValidateUserDetails } = require("../controllers/validation/validate");
const { sequelize } = require("../models");

jest.mock("../models");
jest.mock("../controllers/validation/validate.js");
jest.mock("../service/index.service.js");

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /api/users - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if user details are invalid", async () => {
    const req = { body: { username: "", email: "" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    isValidateUserDetails.mockReturnValue([
      "username is required and should be string",
      "email is required and should be string",
    ]);

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Credentails are required",
      validateUser: [
        "username is required and should be string",
        "email is required and should be string",
      ],
    });
  });

  test("should return 400 if email already exists", async () => {
    const req = { body: { username: "kiran", email: "kiran@gmail.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    isValidateUserDetails.mockReturnValueOnce([]);

    User.findOne.mockResolvedValueOnce({
      id: 1,
      username: "kiran",
      email: "kiran@gmail.com",
    });

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email already exists" });
  });

  test("should return 201 if user is created successfully", async () => {
    const req = { body: { username: "athu", email: "athu@gmail.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    isValidateUserDetails.mockReturnValueOnce([]);
    User.findOne.mockResolvedValueOnce(null);
    addNewUser.mockResolvedValueOnce({
      id: 1,
      username: "athu",
      email: "athu@gmail.com",
    });

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully.",
      newUser: { id: 1, username: "athu", email: "athu@gmail.com" },
    });
  });

  test("should return 500 if an unexpected error occurs", async () => {
    const req = { body: { username: "athu", email: "athu@gmail.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    isValidateUserDetails.mockReturnValueOnce([]);
    User.findOne.mockRejectedValueOnce(new Error("Database connection error"));

    await addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database connection error",
    });
  });
});

describe("POST /api/users - Integration Tests", () => {
  test("should return 400 if user details are invalid", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ username: "", email: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Credentails are required");
    expect(response.body.validateUser).toEqual([
      "username is required and should be string",
      "email is required and should be string",
    ]);
  });

  test("should return 400 if email already exists", async () => {
    User.findOne.mockResolvedValueOnce({ email: "kiran@gmail.com" });

    const response = await request(app).post("/api/users").send({
      username: "kiran",
      email: "kiran@gmail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already exists");
  });

  test("should return 201 if user is created successfully", async () => {
    const newUser = { username: "athu", email: "athu@gmail.com" };
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(newUser);

    const response = await request(app).post("/api/users").send({
      username: "athu",
      email: "athu@gmail.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully.");
    expect(response.body.newUser.username).toBe("athu");
    expect(response.body.newUser.email).toBe("athu@gmail.com");
  });

  test("should return 400 if user creation fails", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(null);

    const response = await request(app).post("/api/users").send({
      username: "athu",
      email: "athu@gmail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Something went wrong while creating User."
    );
  });

  test("should return 500 if an unexpected error occurs", async () => {
    User.findOne.mockRejectedValueOnce(new Error("Unexpected error"));

    const response = await request(app).post("/api/users").send({
      username: "errorUser",
      email: "erroruser@example.com",
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Unexpected error");
  });
});
