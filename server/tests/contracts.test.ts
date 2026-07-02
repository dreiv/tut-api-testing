import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { PaginatedInvoicesContract } from "../src/contracts.js";

describe.concurrent("API Contract Verification Tests", () => {
  it("should validate collection formats", async () => {
    const response = await request(app).get("/api/invoices?page=1&limit=2");
    const result = PaginatedInvoicesContract.safeParse(response.body);
    expect(result.success).toBe(true);
  });
});
