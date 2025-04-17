import { Request, Response } from 'express';
import { publishEvent } from '../events/publisher';
import { getOrderModel } from '../models/order.model'; // Import getOrderModel
import orderSchema from '../schemas/orderSchema'; // Import orderSchema
import { ZodError } from 'zod';

export const createOrder = async (req: Request, res: Response) => {
    try {
        // Validate the request body
        const validatedData = orderSchema.parse(req.body);

        // Get the tenant ID from the request headers
        const tenantId = req.headers['x-tenant-id'] as string;
        if (!tenantId) {
            return res.status(400).json({ status: 'error', message: 'Tenant ID is required' });
        }

        // Publish an event to RabbitMQ, including the tenantId
        await publishEvent('orderQueue', { event: 'order_created', data: validatedData, tenantId });

        res.status(202).json({
            status: 'success',
            message: 'Order creation event published',
            data: validatedData,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const validationErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            res.status(400).json({
                status: 'error',
                message: 'Validation failed. Please check the input fields.',
                errors: validationErrors,
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to publish order creation event',
            });
        }
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const OrderModel = getOrderModel(dbConnection); // Use getOrderModel

    try {
        const orders = await OrderModel.find();
        res.status(200).json({
            status: 'success',
            message: 'Orders fetched successfully',
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch orders',
        });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    const dbConnection = (req as any).dbConnection;

    if (!dbConnection) {
        return res.status(500).json({ status: 'error', message: 'Database connection not found' });
    }

    const OrderModel = getOrderModel(dbConnection); // Use getOrderModel

    try {
        const order = await OrderModel.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order fetched successfully',
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch order',
        });
    }
};
