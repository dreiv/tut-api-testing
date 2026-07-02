const API_BASE_URL = "/api";

interface Invoice {
  id: string;
  clientName: string;
  totalAmount: number;
  status: string;
}

interface PaginatedResponse {
  data: Invoice[];
}

async function fetchInvoices(): Promise<void> {
  const listContainer = document.getElementById("invoice-list");
  if (!listContainer) return;

  try {
    listContainer.innerHTML = `<p>Loading invoices...</p>`;

    const response = await fetch(`${API_BASE_URL}/invoices?page=1&limit=10`);
    if (!response.ok) throw new Error("Failed to fetch invoices");

    const result: PaginatedResponse = await response.json();

    if (result.data.length === 0) {
      listContainer.innerHTML = `<p>No invoices found.</p>`;
      return;
    }

    const listHtml = result.data
      .map(
        (inv) => `
        <div class="invoice-card" style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 4px;">
          <h4>${inv.clientName} (${inv.id})</h4>
          <p>Total: $${inv.totalAmount.toFixed(2)} | Status: <strong>${inv.status}</strong></p>
        </div>
      `,
      )
      .join("");

    listContainer.innerHTML = listHtml;
  } catch (error) {
    listContainer.innerHTML = `<p style="color: red;">Error: ${(error as Error).message}</p>`;
  }
}

document
  .getElementById("load-invoices-btn")
  ?.addEventListener("click", fetchInvoices);
