import { db } from "../db";
import { users, sessions } from "../db/schema";

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

export type LoginUserInput = {
  email: string;
  password: string;
};

export async function loginUser(input: LoginUserInput) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, input.email),
  });

  if (!user) {
    throw new Error("Email atau password salah");
  }

  const valid = await Bun.password.verify(input.password, user.password);
  if (!valid) {
    throw new Error("Email atau password salah");
  }

  const token = crypto.randomUUID();
  await db.insert(sessions).values({ token, userId: user.id });

  return { data: token };
}

export async function getCurrentUser(token: string) {
  const session = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.token, token),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, session.userId!),
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    },
  };
}
