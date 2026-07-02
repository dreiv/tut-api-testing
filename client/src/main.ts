import type { PaginatedResponse } from "./types/api.js";

const API_BASE_URL = "/api";

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
        <div class="invoice-card" style="border: 1px solid #ccc; padding: 12px; margin: 8px 0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0 0 4px 0;">${inv.clientName} <span style="font-size: 0.85em; color: #666; font-weight: normal;">(${inv.id})</span></h4>
            <p style="margin: 0;">Total: $${inv.totalAmount.toFixed(2)} | Status: <strong style="text-transform: capitalize;">${inv.status}</strong></p>
          </div>
          ${
            inv.mascot
              ? `<div style="background-color: #f0f4f8; padding: 4px 10px; border-radius: 12px; border: 1px solid #d0e0f0; font-size: 0.9em; color: #2c5282;">
                  👾 Mascot: <strong style="text-transform: capitalize;">${inv.mascot}</strong>
                 </div>`
              : ""
          }
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
