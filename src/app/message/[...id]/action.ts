"use server";

import { createMessage, getConversationForUsers } from "@/services/messages";
import { v4 as uuid } from "uuid";

export async function sendMessage(
  userId: string,
  recipientId: string,
  message: string
) {
  try {
    const newMessage = await createMessage({
      id: uuid(),
      text: message,
      senderId: userId,
      recipientId,
    });

    console.log("newMessage", newMessage);

    return { success: true, newMessage };
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to send message");
  }
}

export async function getMessages(userId: string, receipientId: string) {
  const messages = await getConversationForUsers(userId, receipientId);

  return messages;
}
