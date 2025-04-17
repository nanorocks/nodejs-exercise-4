import { getRabbitMQChannel } from './rabbitmq';

export const consumeEvents = async (queue: string, onMessage: (event: any) => Promise<void>) => {
    try {
        const channel = getRabbitMQChannel();
        await channel.assertQueue(queue);

        channel.consume(queue, async (message) => {
            if (message) {
                const event = JSON.parse(message.content.toString());
                console.log(`Event received from queue "${queue}":`, event);

                try {
                    await onMessage(event); // Process the event
                    channel.ack(message); // Acknowledge the message after successful processing
                } catch (error) {
                    console.error('Failed to process event:', error);
                    // Optionally, reject the message without requeueing
                    channel.nack(message, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Failed to consume events:', error);
        throw error;
    }
};
