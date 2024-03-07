const fs = require('fs')

class CartManager {
   
    static #ultimoIdCart = 1

    constructor(pathname) {
        this.#carts = []
        this.path = pathname
    }

    async #readCarts() {
        try {
            const fileCarts = await fs.promises.readFile(this.path, 'utf-8')
            this.#carts = JSON.parse(fileCarts)
        }
        catch (err) {
            return []
        }
    }

    inicialize = async () => {
        this.#carts = await this.getCarts()
        CartManager.#ultimoIdCart = this.#getNuevoIdInicio()
    }

    #getNuevoIdInicio = () => {
        let mayorID = 1
        this.#carts.forEach(item => {
            if (mayorID <= item.id)
                mayorID = item.id
        });
        mayorID = mayorID + 1   
        return mayorID
    }

    getCarts = async () => {
        try {
            await this.#readCarts()
            return this.#carts
        }
        catch (err) {
            return []
        }
    }   

    #getNuevoId() {
        const id = CartManager.#ultimoIdCart
        CartManager.#ultimoIdCart++
        return id
    }

    addCart = async (arrayCart) => {



    }

    getCartByCId = async (cid) => {
        const codeIndex = this.#carts.findIndex(e => e.cid === cid)
        if (codeIndex === -1) {
            console.error(`Carrito con ID: ${cid} Not Found`)
            return
        } else {
            return this.#carts[codeIndex]
        }
    }
    
    addProductToCart = async (cid, pid, quantity) => {




    }

    
}

module.exports = CartManager;