import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

let wss: WebSocketServer; // Declare WebSocketServer globally

export const initializeWebSocketServer = (server: http.Server): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            // Attach WebSocketServer to the HTTP server
            wss = new WebSocketServer({ server });

            wss.on('connection', (ws: WebSocket) => {
                console.log('Client connected to WebSocket');

                ws.on('message', (message) => {
                    console.log('Received from client:', message.toString());
                });

                ws.on('close', () => {
                    console.log('Client disconnected from WebSocket');
                });
            });

            console.log('WebSocket server is running');
            resolve();
        } catch (error) {
            console.error('Error initializing WebSocket server:', error);
            reject(error);
        }
    });
};

// Function to send notifications to all connected clients
export const sendNotification = (data: any) => {
    if (!wss) {
        console.error('WebSocket server is not initialized');
        return;
    }

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};