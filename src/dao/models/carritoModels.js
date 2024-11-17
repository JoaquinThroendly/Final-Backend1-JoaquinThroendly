import mongoose from "mongoose";


const carritoEsquema = new mongoose.Schema(
    {
        products: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }, 
            quantity: { type: Number, required: true }
        }]
    },
    {
        timestamps: true
    }
);

export const carritoModelo = mongoose.model('carrito', carritoEsquema);
