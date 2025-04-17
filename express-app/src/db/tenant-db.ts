import mongoose, { Connection } from 'mongoose';

const connections: { [tenantId: string]: Connection } = {};

export const getTenantDbConnection = async (tenantId: string): Promise<Connection> => {
    if (!tenantId) {
        throw new Error('Tenant ID is required');
    }

    // Check if the connection already exists
    if (connections[tenantId]) {
        return connections[tenantId];
    }

    try {
        // Replace with your MongoDB credentials
        const username = process.env.MONGO_INITDB_ROOT_USERNAME || 'admin';
        const password = process.env.MONGO_INITDB_ROOT_PASSWORD || 'pass';
        const host = process.env.MONGO_HOST || 'localhost';
        const port = process.env.MONGO_PORT || '27017';

        // Create a new connection for the tenant
        const dbUri = `mongodb://${username}:${password}@${host}:${port}/${tenantId}?authSource=admin`;
        const connection = await mongoose.createConnection(dbUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is unreachable
        });

        // Cache the connection for future use
        connections[tenantId] = connection;
        return connection;
    } catch (error) {
        console.error(`Failed to connect to database for tenant "${tenantId}":`, error);
        throw new Error('Failed to connect to tenant database');
    }
};
