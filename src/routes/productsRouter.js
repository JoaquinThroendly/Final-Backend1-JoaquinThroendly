import { Router } from 'express';
import { ProductsMongoManager as ProductsManager } from '../dao/ProductsMongoManager.js';
import { productsModelo } from '../dao/models/productsModels.js';
import { isValidObjectId } from 'mongoose';

export const router = Router();

router.get('/', async (req, res) => {
    try {
        const productos = await ProductsManager.getProductos(); // Asegúrate de que esta función existe y devuelve datos correctamente
        res.status(200).json({ productos });
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: "Error al obtener productos." });
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Complete el title, description, code, price, stock, category." });
    }

    try {
        const [productoExistente, productoExistentetitle] = await Promise.all([
            productsModelo.findOne({ code }),
            productsModelo.findOne({ title })
        ]);

        if (productoExistente) {
            return res.status(400).json({ error: `El código ${code} ya está en uso.` });
        }

        if (productoExistentetitle) {
            return res.status(400).json({ error: `El título ${title} ya está en uso.` });
        }

        const nuevoProducto = await ProductsManager.createProducts({ title, description, code, price, stock, category });
        return res.status(201).json({ nuevoProducto });

    } catch (error) {
        console.error("Error al crear producto:", error.message);
        res.status(500).json({ error: "Error al crear el producto." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "ID no válido." });
    }

    try {
        const productoModificado = await ProductsManager.modificaProducts(id, req.body);
        return res.status(200).json({ productoModificado });
    } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "ID no válido." });
    }

    try {
        const productoEliminado = await ProductsManager.eliminarProductos(id);
        return res.status(200).json({ productoEliminado });
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});
