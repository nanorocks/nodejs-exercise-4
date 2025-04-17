import mongoose from 'mongoose';
import config from '../config/app';

const connectToDatabase = async (): Promise<void> => {
    const { username, password, port, host, authSource } = config.mongodb;
    const mongoUri = `mongodb://${username}:${password}@${host}:${port}/?authSource=${authSource}`;

    console.log('Attempting to connect to MongoDB with URI:', mongoUri);

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is unreachable
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        const err = error as Error;
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit the process if the connection fails
    }
};



export default connectToDatabase;
