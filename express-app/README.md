# Node.js Express TypeScript Application

This is a multi-tenant SaaS application built with **Node.js**, **Express**, and **TypeScript**. It supports dynamic database connections, event-driven architecture using RabbitMQ, and real-time notifications using WebSockets.

---

## Features

1. **Dynamic Database Connections**:
   - Each tenant has its own isolated MongoDB database.
   - Middleware dynamically connects to the appropriate database based on the `X-Tenant-ID` header.

2. **Event-Driven Architecture**:
   - RabbitMQ is used to handle asynchronous events like order processing.

3. **Real-Time Notifications**:
   - WebSocket server notifies clients about updates in real time.

4. **Role-Based Access Control (RBAC)**:
   - Users have roles (`admin`, `user`) to restrict access to certain endpoints.

5. **E-Commerce Functionality**:
   - Product management, cart management, and order processing.

---

## Prerequisites

1. **MongoDB**:
   - Running locally or in Docker.
2. **RabbitMQ**:
   - Running locally or in Docker.
3. **Node.js**:
   - Version 14 or higher.
4. **Dependencies**:
   - Install required packages:
     ```bash
     npm install
     ```

---

## Setup

### 1. Environment Variables
Create a [.env](http://_vscodecontentref_/1) file in the root directory with the following content:

```env
PORT=3000

# MongoDB Configuration
MONGO_PORT=27017
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=pass
MONGO_HOST=localhost

# Mongo Express Configuration
MONGO_EXPRESS_PORT=8081

# RabbitMQ Configuration
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```


## Start MongoDB and RabbitMQ
Use Docker to start MongoDB and RabbitMQ:
``` docker-compose up -d ```
## Install Dependencies
Install the required Node.js packages:
```
npm install
```

4. Start the Application
Run the application in development mode:
```
npm run dev
```

## Usage
1. API Endpoints
Users API:
- GET /api/users: Get all users.
- POST /api/users: Create a new user.
Products API:
- GET /api/products: Get all products.
- POST /api/products: Create a new product.
Orders API:
- POST /api/orders: Create a new order.
- GET /api/orders: Get all orders.

## WebSocket Notifications
Connect to the WebSocket server at ws://localhost:3000.
Use the /api/notify endpoint to send notifications to all connected clients:

```
curl -X POST http://localhost:3000/api/notify \
-H "Content-Type: application/json" \
-d '{"message": "Hello, WebSocket clients!"}'
```


## Testing with HTTP Files
Use the .http files in the http-calls directory to test the APIs:
users-api.http
products-api.http
orders-api.http
orders-api-websocket.http

## Development
Run the Application
Start the application in development mode:

```
npm run dev
```
Build the Application
Compile the TypeScript code:
```
npm run build
```

## Testing WebSocket Server
Open the websocket-test.html file in a browser.
Connect to the WebSocket server at ws://localhost:3000.
Send and receive messages in real time.

## Notes
Use zod for request validation.
Use mongoose for database operations.
Use RabbitMQ for event-driven communication.
Use WebSockets for real-time notifications.