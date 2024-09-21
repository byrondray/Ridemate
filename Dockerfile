# Use Bun base image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies with Bun
COPY package.json bun.lockb ./
RUN bun install

# Copy the entire project
COPY . .

# Expose port for Next.js and WebSocket server
EXPOSE 3000 8000

# Command to start both Next.js (in dev mode) and WebSocket server
CMD ["sh", "-c", "bun run dev & bun run ws-server.ts"]
