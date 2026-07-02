export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  taxRate: number; // e.g., 0.20 for 20%
  totalAmount: number;
  status: "draft" | "paid" | "void";
  createdAt: string;
  mascot?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
