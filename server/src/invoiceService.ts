import { Invoice } from "./types.js";

// In-memory data store acting as our database sandbox
export const mockInvoiceDb: Invoice[] = [
  {
    id: "inv-1",
    clientName: "Acme Corp",
    amount: 1000,
    taxRate: 0.2,
    totalAmount: 1200,
    status: "paid",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "inv-2",
    clientName: "Stark Industries",
    amount: 5000,
    taxRate: 0.15,
    totalAmount: 5750,
    status: "draft",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "inv-3",
    clientName: "Wayne Enterprises",
    amount: 2500,
    taxRate: 0.05,
    totalAmount: 2625,
    status: "paid",
    createdAt: "2026-01-03T00:00:00.000Z",
  },
];

export function calculateTotal(amount: number, taxRate: number): number {
  if (amount < 0 || taxRate < 0)
    throw new Error("Amount and tax rate must be positive");
  return amount + amount * taxRate;
}

export function validateInvoiceInput(body: any): string | null {
  if (!body.clientName || typeof body.clientName !== "string")
    return "Invalid or missing clientName";
  if (typeof body.amount !== "number" || body.amount <= 0)
    return "Amount must be a positive number";
  if (typeof body.taxRate !== "number" || body.taxRate < 0 || body.taxRate > 1)
    return "Tax rate must be between 0 and 1";
  return null;
}
