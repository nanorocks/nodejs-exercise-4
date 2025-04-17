import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ successfully');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
};

export const getRabbitMQChannel = (): amqp.Channel => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized. Call connectToRabbitMQ first.');
    }
    return channel;
};
