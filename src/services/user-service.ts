import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterUserInput) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await Bun.password.hash(input.password, {
    algorithm: "bcrypt",
  });

  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  return { data: "OK" };
}
