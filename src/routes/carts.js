const { Router } = require('express');
const router = Router();

const CartManager = require('../CartManager');

const filename = `${__dirname}/../../carrito.json`
const carritoManager = new CartManager(filename)

router.post('/', async (req, res) => {


    
    

})

router.get('/:cid', async (req, res) => {
    let cidCart = +req.params.cid;
    let cartByCID = await carritoManager.getCartByCId(cidCart); 




})

router.post('/:cid/product/:pid', async (req, res) => {




})

const main = async () => {
    await carritoManager.inicialize()
}
main()

module.exports = router;