# Use Bun base image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the entire project and install dependencies
COPY . .
RUN bun install --production

# Expose ports for Next.js and WebSocket server
EXPOSE 3000 8000

# Command to start both Next.js and WebSocket server
CMD ["sh", "-c", "bun run start & bun run ws-server.ts"]
