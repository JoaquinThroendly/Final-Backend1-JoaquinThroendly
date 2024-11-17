import { Router } from 'express';
import { CartsMongoManager as CartsManager } from '../dao/CartsMongoManager.js';
import { ProductsMongoManager as ProductsManager } from '../dao/ProductsMongoManager.js';
import { carritoModelo } from '../dao/models/carritoModels.js';

export const router=Router()


router.get("/", async (req, res) => {
    try {
        let carrito = await CartsManager.getCarts()
        
        return res.status(200).json({ carrito });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});


router.get('/:cid', async (req, res) => {
    const { cid } = req.params; 

    try {
        
        const carrito = await carritoModelo.findById(cid).populate('products.product') 

        
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con id ${cid} no encontrado` });
        }

        
        res.status(200).json({ carrito });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});


router.post('/', async (req,res)=>{

    try {
        let nuevoCarrito = await CartsManager.createCarrito()
        
        res.setHeader('Content-Type','application/json')
        res.status(201).json({nuevoCarrito})

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`${error.message}`})
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const producto = await ProductsManager.getProductosBy({ _id: pid });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const carrito = await carritoModelo.findById(cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productoEnCarrito = carrito.products.find(p => p.product.toString() === pid);
        if (productoEnCarrito) {
            productoEnCarrito.quantity += 1;
        } else {
            carrito.products.push({ product: pid, quantity: 1 });
        }

        console.log("Carrito después de agregar producto: ", carrito);

        await carrito.save();

        res.status(200).json({ mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});



router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params; 
    const { quantity } = req.body; 

    try {
        
        const carrito = await carritoModelo.findById(cid).populate('products.product');
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con id ${cid} no encontrado` });
        }

        
        const productoEnCarrito = carrito.products.find(p => p.product._id.toString() === pid);
        if (!productoEnCarrito) {
            return res.status(404).json({ error: `Producto con id ${pid} no encontrado en el carrito` });
        }

        
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número entero mayor que 0" });
        }

        
        productoEnCarrito.quantity = quantity;

        
        await carrito.save();

        
        res.status(200).json({ mensaje: 'Cantidad de producto actualizada correctamente', carrito });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params; 

    try {
        
        const carrito = await carritoModelo.findById(cid)
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con id ${cid} no encontrado` });
        }

        
        const indiceProducto = carrito.products.find(p => p.product === pid);

        
        if (indiceProducto === -1) {
            return res.status(404).json({ error: `Producto con id ${pid} no encontrado en el carrito` });
        }

        
        carrito.products.splice(indiceProducto, 1);

        
        await carrito.save()

        
        res.status(200).json({ mensaje: `Producto con id ${pid} eliminado del carrito` });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: `${error.message}`
        });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        
        const carrito = await CartsManager.getById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con id ${cid} no encontrado` });
        }

        
        carrito.products = []; 

        
        await carrito.save();

        
        res.status(200).json({ mensaje: 'Todos los productos han sido eliminados del carrito' });
    } catch (error) {
        console.error("Error al eliminar los productos del carrito:", error);
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
});


router.put('/:cid', async (req, res) => {
    const { cid } = req.params;  
    const productosActualizados = req.body.products

    try {
        
        if (!Array.isArray(productosActualizados) || productosActualizados.length === 0) {
            return res.status(400).json({ error: 'El arreglo de productos no es válido' });
        }

        
        const carrito = await CartsManager.getById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con id ${cid} no encontrado` });
        }

        
        carrito.products = productosActualizados;

        
        await carrito.save();

        
        res.status(200).json({ mensaje: 'Carrito actualizado correctamente', carrito });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});
