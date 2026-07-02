import { z } from "zod";

export const InvoiceContract = z
  .object({
    id: z.string().startsWith("inv-"),
    clientName: z.string().min(1),
    amount: z.number().positive(),
    taxRate: z.number().min(0).max(1),
    totalAmount: z.number().positive(),
    status: z.enum(["draft", "paid", "void"]),
    createdAt: z.string().datetime(),
    mascot: z.string().optional(),
  })
  .strict();

export const PaginatedInvoicesContract = z
  .object({
    data: z.array(InvoiceContract),
    meta: z
      .object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        totalRecords: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
      })
      .strict(),
  })
  .strict();
