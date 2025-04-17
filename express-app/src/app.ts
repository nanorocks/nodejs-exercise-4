import express from 'express';
import { setRoutes } from './routes/index';
import logger from './middleware/logger';
import connectToDatabase from './db/mongo-client';
import config from './config/app';
import { connectToRabbitMQ } from './events/rabbitmq';
import { startOrderConsumer } from './events/orderConsumer';
import { initializeWebSocketServer } from './websockets/notificationServer';

import http from 'http';

const app = express();
const PORT = config.app.port;

// Middleware
app.use(express.json());
app.use(logger); // Add the logger middleware

// Connect to MongoDB
connectToDatabase();

// Connect to RabbitMQ and start the consumer
connectToRabbitMQ()
    .then(() => startOrderConsumer())
    .catch((error) => console.error('Failed to initialize RabbitMQ:', error));

const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocketServer(server)
    .then(() => console.log('WebSocket server initialized successfully'))
    .catch((error) => console.error('Failed to initialize WebSocket server:', error));

// Set up routes
setRoutes(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});