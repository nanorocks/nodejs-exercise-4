import { getRabbitMQChannel } from './rabbitmq';

export const publishEvent = async (queue: string, event: any) => {
    try {
        const channel = getRabbitMQChannel();
        await channel.assertQueue(queue);

        // Log the event being published for debugging
        console.log(`Publishing event to queue "${queue}":`, event);

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));
        console.log(`Event published to queue "${queue}":`, event);
    } catch (error) {
        console.error('Failed to publish event:', error);
        throw error;
    }
};
