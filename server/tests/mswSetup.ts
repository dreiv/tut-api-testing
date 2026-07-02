import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://pokeapi.co/api/v2/pokemon/:id", ({ params }) =>
    HttpResponse.json({ name: `mock-pokemon-${params.id}` }),
  ),
];

export const server = setupServer(...handlers);
