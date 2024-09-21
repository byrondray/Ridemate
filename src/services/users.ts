import { users } from "@/database/schema/users";
import { getDB } from "../database/client";
import { eq } from "drizzle-orm";
import { ExtractFunctionReturnType } from "@/utils/typescriptHelpers";

let db = getDB();

export const getUserById = async (id: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.id, id));

    return result[0];
  } catch (error) {
    console.error(error);
  }
};

export type User = ExtractFunctionReturnType<typeof getUserById>;

export const createUser = async (user: User) => {
  return db.insert(users).values(user);
};

export const getUsers = async () => {
  try {
    return db.select().from(users);
  } catch (error) {
    console.error(error);
  }
};
