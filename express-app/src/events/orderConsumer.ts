import { consumeEvents } from './consumer';
import { getOrderModel } from '../models/order.model';
import { getTenantDbConnection } from '../db/tenant-db';

export const startOrderConsumer = async () => {
    await consumeEvents('orderQueue', async (event) => {
        console.log('Received event:', event); // Log the event for debugging

        try {
            // Validate the event structure
            if (!event.tenantId) {
                throw new Error('Tenant ID is missing in the event');
            }
            if (!event.data) {
                throw new Error('Event data is missing');
            }

            // Get the tenant-specific database connection
            const dbConnection = await getTenantDbConnection(event.tenantId);
            const OrderModel = getOrderModel(dbConnection);

            // Create the order in the database
            const order = await OrderModel.create(event.data);
            console.log('Order created successfully:', order);
        } catch (error) {
            console.error('Failed to create order:', error);
        }
    });
};
