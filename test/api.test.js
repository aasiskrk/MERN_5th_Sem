//for sending rrequest
const request = require("supertest");

//servr main file(index.js)

const app = require("../index");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTQ5YjFmNmVlMWE3ZTE1Y2E3MGQ4ZiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkyMDM0NTd9.T40jx1oxg_CVCQUzsFbD7M-l4b6ZWhC8d4iBsnywsoI";

//making test collections
describe("API Test Collection", () => {
  //test case 1(/test)
  it("GET /test | Response text", async () => {
    //Making api request to /test
    const response = await request(app).get("/test");
    //Our response should have 200 status code
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("test api is working ... !");
  });

  it("Get Products | Fetch all products", async () => {
    const response = await request(app)
      .get("/api/product/get_all_products")
      .set("authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.message).toEqual("Product fetched successfully");
  });

  it("Post /api/user/create | Register new user response with message", async () => {
    const response = await request(app).post("/api/user/create").send({
      firstName: "joh",
      lastName: "Cen",
      email: "John@gmail.co",
      password: "123",
    });

    //if already expists
    if (!response.body.success) {
      expect(response.body.message).toEqual("User already exists!");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual("User Created successfully!");
    }
  });
});
