import { Router, Application } from 'express';
import usersRouter from './users';
import productsRouter from './products';
import ordersRouter from './orders';
import { sendNotification } from '../websockets/notificationServer';

const router = Router();

export function setRoutes(app: Application) {
    app.use('/api/users', usersRouter); 
    app.use('/api/products', productsRouter); // Assuming you have a products router
    app.use('/api/orders', ordersRouter);


    app.post('/api/notify', (req, res) => {
        const { message } = req.body;
        sendNotification({ message });
        res.status(200).json({ status: 'success', message: 'Notification sent' });
    });
}

export default router;