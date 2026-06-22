import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser } from "../services/user-service";

export const userRoute = new Elysia({ prefix: "/api/users" })
  .post(
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
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        return await loginUser(body);
      } catch (error) {
        set.status = 401;
        const message =
          error instanceof Error ? error.message : "Terjadi kesalahan";
        return { error: message };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )
  .get("/current", async ({ headers, set }) => {
    const auth = headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const token = auth.slice("Bearer ".length);

    try {
      return await getCurrentUser(token);
    } catch (error) {
      set.status = 401;
      const message = error instanceof Error ? error.message : "Unauthorized";
      return { error: message };
    }
  });
