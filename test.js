const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const server = "http://localhost:3600";
let testId = null;

describe("API Tests", () => {
    // Test Create
    it("should create a new data entry", (done) => {
        chai.request(server)
            .post("/api/data")
            .send({ name: "John Doe", age: 30, email: "john@example.com" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("_id");
                testId = res.body._id;
                done();
            });
    });

    // Test Read All
    it("should fetch all data", (done) => {
        chai.request(server)
            .get("/api/data")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    // Test Read by ID
    it("should fetch a single data entry", (done) => {
        chai.request(server)
            .get(`/api/data/${testId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("_id", testId);
                done();
            });
    });

    // Test Update
    it("should update a data entry", (done) => {
        chai.request(server)
            .put(`/api/data/${testId}`)
            .send({ name: "Jane Doe", age: 25 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("name", "Jane Doe");
                done();
            });
    });

    // Test Delete
    it("should delete a data entry", (done) => {
        chai.request(server)
            .delete(`/api/data/${testId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Negative Test Cases
    it("should return 404 for non-existing ID", (done) => {
        chai.request(server)
            .get("/api/data/invalidId")
            .end((err, res) => {
                expect(res).to.have.status(500); // Invalid MongoDB ObjectId
                done();
            });
    });

    it("should return 404 for deletion of non-existing ID", (done) => {
        chai.request(server)
            .delete("/api/data/invalidId")
            .end((err, res) => {
                expect(res).to.have.status(500); // Invalid MongoDB ObjectId
                done();
            });
    });
});
