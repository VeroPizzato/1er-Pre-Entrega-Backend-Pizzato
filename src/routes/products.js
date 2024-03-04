const { Router } = require('express');
const ProductManager = require('../ProductManager');

const router = Router();

const filename = `{__dirname}/.../productos.json`
const productsManager = new ProductManager(filename)
await productsManager.inicialize()  // VA ACA???

router.get('/', async (req, res) => {
    try {  
        let cantLimite = req.query.limit       
        const listadoProductos = await productsManager.getProducts()

        const prodFiltrados = cantLimite
        ? listadoProductos.slice(0,cantLimite)
        : listadoProductos

        res.send(prodFiltrados)                  
    }
    catch (err) {
        res.send('Error al obtener productos!')
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = Number.parseInt(req.params.pid)  
        const productByID = await productsManager.getProductById(productId);       
        if (!productByID) {
            res.send('Error: Id inexistente!')
            return;
        }
        res.send(productByID);       
    }
    catch (err) {
        res.send('Error al obtener id ' + req.params.id)
    }
});

module.exports = router;