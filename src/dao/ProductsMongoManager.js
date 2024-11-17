import { productsModelo } from "./models/productsModels.js";

export class ProductsMongoManager {

    static async getProducts(filter = {}, page = 1, limit = 10, sortOption = {}) {
        try {
            const sort = sortOption.price ? { price: sortOption.price } : {}; 
            return await productsModelo.paginate(filter, {
                limit,
                page,
                lean: true,
                sort,
            });
        } catch (error) {
            console.error("Error en getProducts:", error.message);
            throw new Error("Error al obtener productos.");
        }
    }

    static async getProductos() {
        try {
            return await productsModelo.find().lean();
        } catch (error) {
            console.error("Error en getProductos:", error.message);
            throw new Error("Error al obtener todos los productos.");
        }
    }

    static async getProductosBy(filtro = {}) {
        try {
            return await productsModelo.findOne(filtro).lean();
        } catch (error) {
            console.error("Error en getProductosBy:", error.message);
            throw new Error("Error al obtener producto por filtro.");
        }
    }

    static async createProducts(productos = {}) {
        try {
            const nuevoProducto = await productsModelo.create(productos);
            return nuevoProducto;
        } catch (error) {
            console.error("Error en createProducts:", error.message);
            throw new Error("Error al crear el producto.");
        }
    }

    static async modificaProducts(id, productos) {
        try {
            return await productsModelo.findByIdAndUpdate(id, productos, { new: true, lean: true });
        } catch (error) {
            console.error("Error en modificaProducts:", error.message);
            throw new Error("Error al modificar el producto.");
        }
    }

    static async getProductosByIds(ids = []) {
        try {
            if (!Array.isArray(ids)) throw new Error("El parámetro debe ser un array de IDs.");
            return await productsModelo.find({ '_id': { $in: ids } }).lean();
        } catch (error) {
            console.error("Error en getProductosByIds:", error.message);
            throw new Error("Error al obtener productos por IDs.");
        }
    }
}
