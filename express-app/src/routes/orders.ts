import { Router } from 'express';
import { createOrder, getAllOrders, getOrderById } from '../controllers/order.controller';
import { tenantMiddleware } from '../middleware/tenant-middleware'; // Import tenantMiddleware

const ordersRouter = Router();

// Use tenantMiddleware for all routes in this router
ordersRouter.use(tenantMiddleware);

// Route to create an order
ordersRouter.post('/', createOrder);

// Route to get all orders
ordersRouter.get('/', getAllOrders);

// Route to get a single order by ID
ordersRouter.get('/:orderId', getOrderById);

export default ordersRouter;
