import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => ({ status: "ok" }))
  .listen(process.env.PORT ?? 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
