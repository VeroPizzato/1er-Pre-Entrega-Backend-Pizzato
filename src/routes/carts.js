const { Router } = require('express');
const router = Router();

const CartManager = require('../CartManager');
const ProductManager = require('../ProductManager')

const filename = `${__dirname}/../../carrito.json`
const carritoManager = new CartManager(filename)

const productsManager = new ProductManager(`${__dirname}/../../productos.json`)

async function validarNuevoCarrito(req, res, next) {
    const { products } = req.body;

    const listadoProductos = await productsManager.getProducts()
    products.forEach(producto => {
        const codeIndex = listadoProductos.findIndex(e => e.id === producto.pid);
        if (codeIndex === -1) {
            res.status(400).json({ error: "Producto con ID:" + producto.pid + " not Found" })
            return
        }
    });        

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

router.post('/:cid/product/:pid', async (req, res) => {   
    let idCart = +req.params.cid;
    let idProd = +req.params.pid;
    let quantity = 1;   

    let nuevoProd = await manejadorCarrito.addProductToCart(idCart, idProd, quantity);
    if (!nuevoProd) {
        res.status(404).json({ error: "Producto inexistente!" })  // HTTP 404 => no se encontró ese producto
        return
    }
    res.status(200).json(nuevoProd)    // HTTP 200 OK
})

const main = async () => {
    await carritoManager.inicialize()
}
main()

module.exports = router;