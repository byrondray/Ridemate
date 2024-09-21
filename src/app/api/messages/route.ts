import { NextResponse } from "next/server";
import { getConversationForUsers, createMessage } from "@/services/messages";
import { v4 as uuid } from "uuid";

interface Message {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
}

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  const senderId = formData.get("senderId") as string;
  const recipientId = formData.get("recipientId") as string;

  if (!text || !senderId || !recipientId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newMessage = await createMessage({
      id: uuid(),
      text,
      senderId,
      recipientId,
    });
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

interface GetRequest extends Request {
  url: string;
}

export async function GET(request: GetRequest): Promise<Response> {
  console.log(request.url, "HERE");
  const { searchParams } = new URL(request.url);
  const currentUserId: string | null = searchParams.get("currentUserId");
  const receiverUserId: string | null = searchParams.get("receiverUserId");

  if (!currentUserId || !receiverUserId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const messages: Message[] = await getConversationForUsers(
      currentUserId,
      receiverUserId
    );
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
