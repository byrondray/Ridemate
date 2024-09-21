# Use Bun base image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lockb ./
RUN bun install --production

# Copy the rest of the project
COPY . .

# Build the Next.js project for production
RUN bun next build

# Expose the necessary ports
EXPOSE 3000 8000

# Start both Next.js in production and WebSocket server
CMD ["sh", "-c", "bun next start"]
