# Use official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Expose port 8080 (Cloud Run uses 8080 by default)
EXPOSE 8080

# Command to start the server
CMD ["node", "server.js"]
