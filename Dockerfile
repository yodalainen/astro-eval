# Stage 1: Build the Astro project
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Serve the built project
FROM node:20-alpine
WORKDIR /app

# Copy the build output
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Expose port
EXPOSE 4321

# Set host to allow external connections
ENV HOST=0.0.0.0
ENV PORT=4321

# Start the standalone server
CMD ["node", "./dist/server/entry.mjs"]
