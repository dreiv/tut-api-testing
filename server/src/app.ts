import express, { Request, Response } from "express";
import {
  mockInvoiceDb,
  calculateTotal,
  validateInvoiceInput,
} from "./invoiceService.js";
import { Invoice } from "./types.js";

const app = express();
app.use(express.json());

async function fetchMascotName(): Promise<string> {
  if (process.env.NODE_ENV === "load") {
    return "load-test-pokemon";
  }

  try {
    // Generate a random ID between 1 and 151 (Gen 1)
    const randomPokemonId = Math.floor(Math.random() * 151) + 1;

    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`,
    );

    if (pokeResponse.ok) {
      const pokeData = (await pokeResponse.json()) as { name: string };
      return pokeData.name;
    }
  } catch (err) {
    console.error("Failed to fetch mascot from PokeAPI:", err);
  }
  return "Fallback Mascot";
}

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

app.post(
  "/api/invoices",
  async (req: Request, res: Response): Promise<void> => {
    const error = validateInvoiceInput(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const { clientName, amount, taxRate } = req.body;
    const totalAmount = calculateTotal(amount, taxRate);

    const mascot = await fetchMascotName();

    const newInvoice: Invoice = {
      id: `inv-${mockInvoiceDb.length + 1}`,
      clientName,
      amount,
      taxRate,
      totalAmount,
      status: "draft",
      createdAt: new Date().toISOString(),
      mascot,
    };

    mockInvoiceDb.push(newInvoice);
    res.status(201).json(newInvoice);
  },
);

export default app;
