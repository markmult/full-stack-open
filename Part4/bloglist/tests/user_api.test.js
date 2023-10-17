const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");
const helper = require("./test_helper");

const saltRounds = 10;

describe("user exists in database", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("test_pass", saltRounds);
    let user = new User({
      username: "initial_user",
      name: "name",
      passwordHash,
    });
    await user.save();
  });

  test("users can be requested", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(1);
  });

  test("user can be created", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "new_username",
      name: "new_name",
      password: "password1",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creating user fails if user exists", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "initial_user",
      name: "I_exist",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creating user fails without username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      name: "username_missing",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username or password missing");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creating user fails without password", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "password_missing",
      name: "password_missing",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username or password missing");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creating user faisl with too short username", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "us",
      name: "too_short",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "username and password must contain at least 3 characters"
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creating user fails with too short password", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "short_password",
      name: "too_short",
      password: "12",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "username and password must contain at least 3 characters"
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
