import { Elysia, t } from "elysia";
import { registerUser } from "../services/user-service";

export const userRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    try {
      return await registerUser(body);
    } catch (error) {
      set.status = 400;
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      return { error: message };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 1 }),
    }),
  }
);
