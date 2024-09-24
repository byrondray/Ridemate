import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });
const clients = new Map<string, WebSocket>();

wss.on("connection", (ws) => {
  let userId: string | null = null;
  console.log("New client connected");

  ws.on("message", (data) => {
    try {
      const messageObj = JSON.parse(data.toString());
      const { type, userId: senderId, message, recipientId } = messageObj;
      if (type === "register" && senderId) {
        console.log(`Registering user ${senderId}`);
        if (!clients.has(senderId)) {
          clients.set(senderId, ws);
          userId = senderId;
        }
        return;
      }

      if (type === "message") {
        if (clients.has(recipientId)) {
          const recipientWs = clients.get(recipientId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(`User ${senderId}: ${message}`);
          } else {
            console.log(
              `Recipient ${recipientId} is not ready or disconnected.`
            );
          }
        } else {
          console.log(`Recipient ${recipientId} is not connected.`);
        }
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });

  ws.on("close", () => {
    if (userId) {
      clients.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  });
});

console.log("WebSocket server is running on ws://localhost:8000");
