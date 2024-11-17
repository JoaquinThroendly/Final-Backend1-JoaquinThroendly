import { carritoModelo } from './models/carritoModels.js';

export class CartsMongoManager{

    static async getById(id) {
        return await carritoModelo.findById(id).populate('products.product');
    }
    static async getCarts() {
        return await carritoModelo.find(); 
    }
    
    static async createCarrito() {
        let carritoNuevo = await carritoModelo.create({ productos: [] });
        return carritoNuevo.toJSON(); 
    }
    
    static async actualizarCarrito(id, carrito){
        return await carritoModelo.findByIdAndUpdate(id, carrito, {new: true})
    }
}
