import { Schema, model, Connection } from 'mongoose';

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export const getOrderModel = (connection: Connection) => {
    // Check if the model is already registered to avoid duplicate model errors
    return connection.models.Order || connection.model('Order', orderSchema);
};