import { Schema, model, Connection } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
}, { timestamps: true });

export const getProductModel = (connection: Connection) => {
    return connection.model('Product', productSchema);
};
