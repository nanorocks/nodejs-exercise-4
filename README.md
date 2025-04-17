# Exercise 4: Multi-Tenant SaaS with Event-Driven Architecture and Real-Time Notifications

## Description
Build a multi-tenant SaaS application with:
1. **Dynamic Database Connections**: Each tenant has its own isolated database.
2. **Event-Driven Architecture**: Use RabbitMQ to handle asynchronous events like order processing.
3. **Real-Time Notifications**: Use WebSockets to notify clients about updates in real time.

---

## Prerequisites
1. **MongoDB**: Running locally or in Docker.
2. **RabbitMQ**: Running locally or in Docker.
3. **Dependencies**: Install the required packages:
   ```bash
   npm install mongoose amqplib ws
   npm install --save-dev @types/ws
   ```

---

## Implementation Steps

### 1. Dynamic Database Connections
Each tenant has its own database. Use middleware to dynamically connect to the appropriate database based on the `x-tenant-id` header.

#### Code Example: Tenant Middleware
```typescript
// filepath: /src/middleware/tenantMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import config from '../config/app';

const connections: { [key: string]: mongoose.Connection } = {};

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
    }

    if (!connections[tenantId]) {
        try {
            const dbUri = `mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${tenantId}?authSource=${config.mongodb.authSource}`;
            const connection = await mongoose.createConnection(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            connections[tenantId] = connection;
        } catch (error) {
            return res.status(500).json({ error: 'Failed to connect to tenant database' });
        }
    }

    req['dbConnection'] = connections[tenantId];
    next();
};
```

---

### 2. Event-Driven Architecture with RabbitMQ
Use RabbitMQ to handle asynchronous events like order processing.

#### Code Example: Event Publisher
```typescript
// filepath: /src/events/publisher.ts
import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectToBroker = async () => {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('orderQueue');
};

export const publishEvent = async (event: string, data: any) => {
    if (!channel) {
        throw new Error('Message broker not connected');
    }
    channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify({ event, data })));
};
```

#### Code Example: Event Consumer
```typescript
// filepath: /src/events/consumer.ts
import amqp from 'amqplib';

export const consumeEvents = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('orderQueue');

    channel.consume('orderQueue', (message) => {
        if (message) {
            const event = JSON.parse(message.content.toString());
            console.log('Received event:', event);
            channel.ack(message);
        }
    });
};
```

---

### 3. Real-Time Notifications with WebSockets
Use WebSockets to notify clients about updates in real time.

#### Code Example: WebSocket Server
```typescript
// filepath: /src/websockets/notificationServer.ts
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message.toString());
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

export const sendNotification = (data: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(data));
        }
    });
};
```

---

### 4. Admin Analytics
Create an endpoint to fetch analytics data for admins.

#### Code Example: Analytics Endpoint
```typescript
// filepath: /src/controllers/analyticsController.ts
import { Request, Response } from 'express';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // Simulate fetching analytics data
        const analytics = {
            totalOrders: 100,
            totalRevenue: 5000,
            activeUsers: 50,
        };

        res.status(200).json({
            status: 'success',
            data: analytics,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch analytics',
        });
    }
};
```

---

## How to Run the Application

### Step 1: Start MongoDB and RabbitMQ
- Start MongoDB and RabbitMQ using Docker:
  ```bash
  docker-compose up -d
  ```

### Step 2: Start the Application
- Start the application:
  ```bash
  npm run dev
  ```

### Step 3: Start the WebSocket Server
- Start the WebSocket server:
  ```bash
  ts-node src/websockets/notificationServer.ts
  ```

### Step 4: Start the Event Consumer
- Start the RabbitMQ event consumer:
  ```bash
  ts-node src/events/consumer.ts
  ```

---

## Testing the Application

### 1. Test Dynamic Database Connections
- Use Postman or curl to send requests with the `x-tenant-id` header.

### 2. Test Event-Driven Architecture
- Publish an event using the `publishEvent` function and verify it is consumed by the consumer.

### 3. Test Real-Time Notifications
- Connect a WebSocket client to `ws://localhost:8080` and send/receive messages.

---

## Notes
- Use `zod` for request validation.
- Use `mongoose` for database operations.
- Use RabbitMQ for event-driven communication.
- Use WebSockets for real-time notifications.
