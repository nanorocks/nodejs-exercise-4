import mongoose, { Connection } from 'mongoose';
import config from '../config/app';

const connections: { [key: string]: Connection } = {};

export const switchDatabase = async (tenantId: string): Promise<Connection> => {
    if (!tenantId) {
        throw new Error('Tenant ID is required to switch databases');
    }

    // Check if a connection for the tenant already exists
    if (connections[tenantId]) {
        return connections[tenantId];
    }

    // Create a new connection for the tenant
    const { username, password, port, host, authSource } = config.mongodb;
    const dbUri = `mongodb://${username}:${password}@${host}:${port}/${tenantId}?authSource=${authSource}`;

    try {
        const connection = await mongoose.createConnection(dbUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is unreachable
        });
        connections[tenantId] = connection;
        console.log(`Connected to database for tenant: ${tenantId}`);
        return connection;
    } catch (error) {
        console.error(`Failed to connect to database for tenant: ${tenantId}`, error);
        throw error;
    }
};
