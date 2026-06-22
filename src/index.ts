import { Elysia } from "elysia";
import { userRoute } from "./routes/user-route";

const app = new Elysia()
  .get("/", () => ({ status: "ok" }))
  .use(userRoute)
  .listen(process.env.PORT ?? 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
