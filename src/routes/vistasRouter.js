import { Router } from 'express';
import {ProductsMongoManager as ProductsManager} from "../dao/ProductsMongoManager.js"
import { CartsMongoManager as CartsManager} from '../dao/CartsMongoManager.js';
import { carritoModelo } from '../dao/models/carritoModels.js';

export const router=Router()

router.get('/',(req,res)=>{

    res.render("home")
})


router.get('/products', async (req, res) => {
    let { page = 1, limit = 10, query = "", sort = "" } = req.query

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page <= 0) page = 1
    if (isNaN(limit) || limit <= 0) limit = 10

    let filter = {};
    if (query) {
        filter.category = new RegExp(query, 'i')
    }

    let sortOption = {};
    if (sort === "asc") {
        sortOption.price = 1;
    } else if (sort === "desc") {
        sortOption.price = -1; 
    }

    let { docs: productos, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = await ProductsManager.getProducts(filter, page, limit, sortOption);

    res.render('index', {
        productos,
        totalPages, 
        hasNextPage, 
        hasPrevPage, 
        nextPage, 
        prevPage,
        page,  
        limit, 
        sort,  
        query
    });

});

router.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await ProductsManager.getProductosBy({ _id: id });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.render('productDetails', { producto });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }

});

router.get('/cart', async(req, res) => {
    let carrito = await CartsManager.getCarts()

    res.render('carts', {carrito});
});

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carrito = await carritoModelo.findById(cid).populate('products.product');
        const productos = carrito.products.map(p => p.toJSON());

        res.render('carts', { 
            carritoId: cid, 
            productos 
        });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});
