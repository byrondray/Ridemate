"use client";
import { useEffect, useState } from "react";

export default function Chat({
  userId,
  recipientId,
}: {
  userId: string;
  recipientId: string;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  console.log("Chat params:", { userId, recipientId });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(JSON.stringify({ type: "register", userId }));
    };

    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageObj = {
        type: "message",
        userId,
        message: newMessage,
        recipientId,
      };
      socket.send(JSON.stringify(messageObj));
      setNewMessage("");
    } else {
      console.error("WebSocket is not open. Ready state:", socket?.readyState);
    }
  };

  return (
    <div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
