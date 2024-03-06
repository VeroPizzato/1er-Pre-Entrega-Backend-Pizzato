const { Router } = require('express')
const router = Router()

const ProductManager = require('../ProductManager')

const filename = `${__dirname}/../../productos.json`
const productsManager = new ProductManager(filename)

// Middleware para validacion de datos al agregar un producto (post)
function validarNuevoProducto(req, res, next) {
    const { titulo, descripcion, precio, ruta, codigo, stock, status, categoria } = req.body;
    if (!titulo || !descripcion || !precio || !codigo || !stock || !status || !categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, salvo la ruta de la imagen' });
    }
    if (isNaN(precio) || isNaN(stock)) {
        res.status(400).json({ error: "Invalid number format" })
        return
    }
    const codeIndex = productsManager.getProducts.findIndex(e => e.code === codigo)
    if (codeIndex !== -1) {
        res.status(400).json({ error: "Codigo ya existente" })
        return
    }
    if (!productsManager.soloNumYletras(codigo)) {
        res.status(400).json({ error: "El campo codigo identificador es invalido." })
        return
    }
    if (status != true && status != false) {
        res.status(400).json({ error: "El campo status es invalido." })
        return
    }
    next()
}

// Middleware para validacion de datos al actualizar un producto (put)
// Si algun dato es vacio no se actualiza
function validarProdActualizado(req, res, next) {
    const { newTitle, newDescription, newPrice, newThumbnail, newCode, newStock, newStatus, newCategory } = req.body;
    const { prodId } = req.params.id
    const codeIndex = productsManager.getProducts.findIndex(e => e.id === prodId);
    if (codeIndex === -1) {
        res.status(400).json({ error: "Producto con ID:" + prodId + " not Found" })
        return
    }
    else {
        if (newPrice !== '') {
            if (isNaN(newPrice)) {
                res.status(400).json({ error: "Error. El campo precio es invalido." })
                return
            }
        }
        if (newStock !== '') {
            if (isNaN(newStock)) {
                res.status(400).json({ error: "El campo stock es invalido." })
                return
            }
        }
        if (newCode !== '') {
            const existingCode = listadoProductos.findIndex(item => item.code === newCode);
            if (existingCode !== -1) {
                res.status(400).json({ error: "Codigo ya existente" })
                return
            }
            if (!productsManager.soloNumYletras(newCode)) {
                res.status(400).json({ error: "El campo codigo identificador es invalido." })
                return
            }
        }
        if (newStatus != true && newStatus != false) {
            res.status(400).json({ error: "El campo status es invalido." })
            return
        }
    }
    next()
}

router.get('/', async (req, res) => {
    let cantLimite = req.query.limit

    const listadoProductos = await productsManager.getProducts()
    let prodFiltrados = []

    if (cantLimite) {
        if (isNaN(cantLimite) || (cantLimite < 0)) {
            // HTTP 400 => hay un error en el request o alguno de sus parámetros
            res.status(400).json({ error: "Invalid limit format" })
            return
        }
        prodFiltrados = listadoProductos.slice(0, cantLimite)
    }
    else prodFiltrados = listadoProductos

    res.status(200).json(prodFiltrados)  // HTTP 200 OK
})

router.get('/:pid', (req, res) => {
    const productId = +req.params.pid

    if (isNaN(productId)) {
        // HTTP 400 => hay un error en el request o alguno de sus parámetros
        res.status(400).json({ error: "Invalid ID format" })
        return
    }

    const productByID = productsManager.getProductById(productId)
    if (!productByID) {
        res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese producto
        return
    }
    res.status(200).json(productByID)    // HTTP 200 OK
})

router.post('/', validarNuevoProducto, async (req, res) => {
    const producto = req.body

    const nuevoProducto = await productsManager.addProduct(producto.title, producto.description, producto.price, producto.thumbnail, producto.code, producto.stock, producto.status, producto.category)

    res.status(201).json({ message: "Producto agregado correctamente", producto: nuevoProducto })
})

router.put('/:pid', validarProdActualizado, async (req, res) => {
    const productID = +req.params.pid
    const producto = req.body

    await manejadorDeProductos.updateProduct(productID, producto);

    return res.status(200).json({ message: "Producto actualizado correctamente" });
});

router.delete('/:pid', async (req, res) => {
    let idProd = +req.params.pid;
    let DelproductByID = await manejadorDeProductos.deleteProduct(idProd);
    if (!DelproductByID) {
        res.status(404).json({ error: "Id inexistente!" })  // HTTP 404 => el ID es válido, pero no se encontró ese producto
        return
    }
    res.status(200).json({ message: "Producto Eliminado correctamente" })    // HTTP 200 OK
});

const main = async () => {
    await productsManager.inicialize()
}
main()

module.exports = router