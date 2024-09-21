import { getDB } from "@/database/client";
import { messages } from "@/database/schema/messages";
import { ExtractFunctionReturnType } from "@/utils/typescriptHelpers";
import { and, eq } from "drizzle-orm";

let db = getDB();

export const getMessageByMessageId = async (id: string) => {
  const result = await db.select().from(messages).where(eq(messages.id, id));

  return result[0];
};

export type Message = ExtractFunctionReturnType<typeof getMessageByMessageId>;

export const getConversationForUsers = async (
  userId1: string,
  userId2: string
) => {
  const result = await db
    .select()
    .from(messages)
    .where(
      and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2))
    );

  return result;
};

export const createMessage = async (message: {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
}) => {
  return db.insert(messages).values(message).returning();
};
