const { Router } = require('express');
const router = Router();

const ProductManager = require('../ProductManager');

const filename = `${__dirname}/../../productos.json`
const productsManager = new ProductManager(filename)

// Middleware para validacion de datos al agregar un producto (post)
function validarDatos (req, res, next) {
   



    next()
}


router.get('/', async (req, res) => {
    let cantLimite = req.query.limit
    
    const listadoProductos = await productsManager.getProducts()
    let prodFiltrados = []

    if (cantLimite){
        if (isNaN(cantLimite) || (cantLimite<0) ) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid ID format" })
            return
        }
        prodFiltrados = listadoProductos.splice(0, cantLimite)
    }
    else prodFiltrados = listadoProductos

    res.status(200).json(prodFiltrados)  // HTTP 200 OK

});

router.get('/:pid', (req, res) => {

    const productId = Number.parseInt(req.params.pid)

    if (isNaN(productId)) {
        // HTTP 400 => hay un error en el request o alguno de sus parámetros
        res.status(400).json({ error: "Invalid ID format" })
        return
    }

    const productByID = productsManager.getProductById(productId);    
    if (!productByID) {
        res.status(404).json({ Error: "Id inexistente!"})  // HTTP 404 => el ID es válido, pero no se encontró ese producto
        return;
    }
    res.status(200).json(productByID);    // HTTP 200 OK

});

router.post('/', validarDatos, async (req, res) => {
    const product = req.body
    


    
});

const main = async () => {
    await productsManager.inicialize()
}
main()

module.exports = router;