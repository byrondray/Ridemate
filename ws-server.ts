import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });
const clients = new Map<string, WebSocket>();

function heartbeat() {
  console.log(clients.size, "clients");
  for (const [userId, ws] of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ping" }));
    }
  }
}

setInterval(heartbeat, 1000); // Send a ping every second for demo

wss.on("connection", (ws) => {
  let userId: string | null = null;
  console.log("New client connected");

  ws.on("message", (data) => {
    try {
      const messageObj = JSON.parse(data.toString());
      const { type, userId: senderId, message, recipientId } = messageObj;
      console.log(messageObj);
      if (type === "register" && senderId) {
        console.log(`Registering user ${senderId}`);
        if (!clients.has(senderId)) {
          clients.set(senderId, ws);
          userId = senderId;
          console.log(`User ${senderId} connected and registered`);
        }
        return;
      }

      if (type === "message") {
        console.log(
          `User ${senderId} sent a message to ${recipientId}: ${message}`
        );

        if (clients.has(recipientId)) {
          const recipientWs = clients.get(recipientId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(`User ${senderId}: ${message}`);
            console.log(`Message sent to User ${recipientId}: ${message}`);
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
