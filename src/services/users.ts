import { users } from "@/database/schema/users";
import { getDB } from "../database/client";
import { eq } from "drizzle-orm";
import { ExtractFunctionReturnType } from "@/utils/typescriptHelpers";

let db = getDB();

export const getUserById = async (id: string) => {
  const result = await db.select().from(users).where(eq(users.id, id));

  return result[0];
};

export type User = ExtractFunctionReturnType<typeof getUserById>;

export const createUser = async (user: User) => {
  return db.insert(users).values(user);
};
