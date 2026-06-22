import { db } from "../db";
import { users } from "../db/schema";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterUserInput) {
  const existing = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, input.email),
  });

  if (existing) {
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
