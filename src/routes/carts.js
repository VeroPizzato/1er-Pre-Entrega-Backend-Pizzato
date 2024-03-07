const { Router } = require('express');
const router = Router();

const CartManager = require('../CartManager');
const ProductManager = require('../ProductManager')

const filename = `${__dirname}/../../carrito.json`
const carritoManager = new CartManager(filename)

const productsManager = new ProductManager(`${__dirname}/../../productos.json`)

// Middleware para validacion de datos al agregar un carrito (post)
async function validarNuevoCarrito(req, res, next) {
    const { products } = req.body;

    const listadoProductos = await productsManager.getProducts()
    products.forEach(producto => {      
        const codeIndex = listadoProductos.findIndex(e => e.pid === producto.pid);
        if (codeIndex === -1) {
            res.status(400).json({ error: "Producto con ID:" + producto.pid + " not Found" })
            return
        }
        if (isNaN(producto.quantity) || (!productsManager.soloNumPositivos(producto.quantity))) {
            res.status(400).json({ error: "Invalid quantity format" })
            return
        }
    });   

    next()
}

// Middleware para validacion de carrito existente (post)
async function ValidarCarritoExistente(req, res, next) {  
    let cId = +req.params.cid;  
    const listadoCarritos = await carritoManager.getProducts()
    const codeIndex = listadoCarritos.findIndex(e => e.cid === cId);
    if (codeIndex === -1) {
        res.status(400).json({ error: "Carrito con ID:" + cId + " not Found" })
        return
    }

    next()
}

// Middleware para validacion de producto existente (post)
async function ValidarProductoExistente(req, res, next) {
    let pId = +req.params.pid;
    const listadoProductos = await productsManager.getProducts()
    const codeIndex = listadoProductos.findIndex(e => e.pid === pId);
    if (codeIndex === -1) {
        res.status(400).json({ error: "Producto con ID:" + pId + " not Found" })
        return
    }

    next()
}

router.post('/', validarNuevoCarrito, async (req, res) => {
    const { products } = req.body;

    const nuevoCarrito = await carritoManager.addCart(products);
    
    res.status(201).json({ message: "Carrito agregado correctamente", carrito: nuevoCarrito })
})

router.get('/:cid', async (req, res) => {
    let cidCart = +req.params.cid;

    if (isNaN(cidCart)) {
        // HTTP 400 => hay un error en el request o alguno de sus parámetros
        res.status(400).json({ error: "Invalid ID format" })
        return
    }

    let cartByCID = await carritoManager.getCartByCId(cidCart); 

    if (!cartByCID) {
        res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese carrito
        return
    }
    res.status(200).json(cartByCID)    // HTTP 200 OK
})

router.post('/:cid/product/:pid', ValidarCarritoExistente, ValidarProductoExistente, async (req, res) => {   
    let idCart = +req.params.cid;
    let idProd = +req.params.pid;
    let quantity = 1;   

    let nuevoProd = await carritoManager.addProductToCart(idCart, idProd, quantity);
   
    res.status(200).json(nuevoProd)    // HTTP 200 OK
})

const main = async () => {
    await carritoManager.inicialize()
}
main()

module.exports = router;