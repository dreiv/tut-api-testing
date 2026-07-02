import express, { Request, Response } from "express";
import {
  mockInvoiceDb,
  calculateTotal,
  validateInvoiceInput,
} from "./invoiceService.js";
import { Invoice } from "./types.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// GET /api/invoices (Paginated)
app.get("/api/invoices", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedItems = mockInvoiceDb.slice(startIndex, endIndex);

  res.json({
    data: paginatedItems,
    meta: {
      page,
      limit,
      totalRecords: mockInvoiceDb.length,
      totalPages: Math.ceil(mockInvoiceDb.length / limit),
    },
  });
});

// POST /api/invoices (With Validation)
app.post("/api/invoices", (req: Request, res: Response): void => {
  const error = validateInvoiceInput(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const { clientName, amount, taxRate } = req.body;
  const totalAmount = calculateTotal(amount, taxRate);

  const newInvoice: Invoice = {
    id: `inv-${mockInvoiceDb.length + 1}`,
    clientName,
    amount,
    taxRate,
    totalAmount,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  mockInvoiceDb.push(newInvoice);
  res.status(201).json(newInvoice);
});

app.listen(PORT, () => {
  console.log(`Testing API sandbox running at http://localhost:${PORT}`);
});
