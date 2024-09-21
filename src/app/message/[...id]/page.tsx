"use client";

import { useEffect, useState } from "react";
import { Message } from "@/services/messages";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        "/api/messages?currentUserId=kp_2094a928179447078aa5f5f27df766bc&receiverUserId=kp_b20575f122824fe5b0099f12948a4912",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data: Message[] = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <form action="/api/messages" method="post">
        <input
          name="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <input
          type="hidden"
          name="senderId"
          value="kp_2094a928179447078aa5f5f27df766bc"
        />
        <input
          type="hidden"
          name="recipientId"
          value="kp_b20575f122824fe5b0099f12948a4912"
        />
        <button type="submit">Send</button>
      </form>

      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            {msg.senderId}: {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}
