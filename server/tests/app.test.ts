import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { server } from "./mswSetup.js";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Invoice API - Integration Tests", () => {
  describe("GET /api/invoices", () => {
    it("should return a 200 OK status and the paginated structure", async () => {
      const response = await request(app).get("/api/invoices?page=1&limit=2");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("meta");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta.page).toBe(1);
    });
  });

  describe("POST /api/invoices", () => {
    it("should successfully create an invoice and return 201 Created", async () => {
      const newInvoicePayload = {
        clientName: "Initech",
        amount: 1000,
        taxRate: 0.1,
      };

      const response = await request(app)
        .post("/api/invoices")
        .send(newInvoicePayload);

      expect(response.status).toBe(201);
      expect(response.body.clientName).toBe("Initech");
      expect(response.body.totalAmount).toBe(1100);
      expect(response.body).toHaveProperty("id");

      expect(response.body.mascot).toEqual(
        expect.stringContaining("mock-pokemon-"),
      );
    });

    it("should return 400 Bad Request if the payload is invalid", async () => {
      const badPayload = {
        clientName: "",
        amount: -50,
      };

      const response = await request(app)
        .post("/api/invoices")
        .send(badPayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
});
