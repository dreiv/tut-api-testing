import { describe, it, expect } from "vitest";
import { calculateTotal, validateInvoiceInput } from "./invoiceService.js";

describe("Invoice Service - Unit Tests", () => {
  describe("calculateTotal", () => {
    it("should correctly compute total with tax applied", () => {
      const total = calculateTotal(100, 0.2); // $100 + 20% tax
      expect(total).toBe(120);
    });

    it("should throw an error if amount or tax rate is negative", () => {
      expect(() => calculateTotal(-100, 0.2)).toThrow(
        "Amount and tax rate must be positive",
      );
      expect(() => calculateTotal(100, -0.05)).toThrow(
        "Amount and tax rate must be positive",
      );
    });
  });

  describe("validateInvoiceInput", () => {
    it("should return null for valid invoice payloads", () => {
      const validPayload = {
        clientName: "Wayne Enterprises",
        amount: 2500,
        taxRate: 0.05,
      };
      expect(validateInvoiceInput(validPayload)).toBeNull();
    });

    it("should catch missing or incorrect client names", () => {
      const invalidPayload = { amount: 500, taxRate: 0.1 };
      expect(validateInvoiceInput(invalidPayload)).toBe(
        "Invalid or missing clientName",
      );
    });

    it("should catch non-positive amounts", () => {
      const invalidPayload = {
        clientName: "Test Corp",
        amount: -10,
        taxRate: 0.1,
      };
      expect(validateInvoiceInput(invalidPayload)).toBe(
        "Amount must be a positive number",
      );
    });

    it("should catch out-of-bounds tax rates", () => {
      const invalidPayload = {
        clientName: "Test Corp",
        amount: 100,
        taxRate: 1.5,
      };
      expect(validateInvoiceInput(invalidPayload)).toBe(
        "Tax rate must be between 0 and 1",
      );
    });
  });
});
