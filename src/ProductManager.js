const fs = require('fs')

class ProductManager {

    #products
    static #ultimoIdProducto = 1

    constructor(pathname) {
        this.#products = []
        this.path = pathname
    }

    async #readProducts() {
        try {
            const fileProducts = await fs.promises.readFile(this.path, 'utf-8')
            this.#products = JSON.parse(fileProducts)
        }
        catch (err) {
            return []
        }
    }

    inicialize = async () => {
        this.#products = await this.getProducts()
        ProductManager.#ultimoIdProducto = this.#getNuevoIdInicio()
    }

    #getNuevoIdInicio = () => {
        let mayorID = 1
        this.#products.forEach(item => {
            if (mayorID <= item.id)
                mayorID = item.id
        });
        return mayorID
    }

    getProducts = async () => {
        try {
            this.#readProducts()
            return this.#products
        }
        catch (err) {
            return []
        }
    }

    getProductById = async (id) => {
        const codeIndex = this.#products.findIndex(e => e.id === id)
        if (codeIndex === -1) {
            return (`Producto con ID: ${id} Not Found`)
        } else {
            return this.#products[codeIndex]
        }
    }

    #getNuevoId() {
        const id = ProductManager.#ultimoIdProducto
        ProductManager.#ultimoIdProducto++
        return id
    }

    #soloNumYletras = (code) => {
        return (/^[a-z A-Z 0-9]+$/.test(code))
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (title.trim().length === 0) {
            console.error("Error. El campo titulo es invalido.")
            return
        }

        if (description.trim().length === 0) {
            console.error("Error. El campo descripción es invalido.")
            return
        }

        if (isNaN(price)) {
            console.error("Error. El campo precio es invalido.")
            return
        }

        if (thumbnail.trim().length === 0) {
            console.error("Error. El campo ruta de imagen es invalido.")
            return
        }

        if (isNaN(stock)) {
            console.error("Error. El campo stock es invalido.")
            return
        }

        if (!this.#soloNumYletras(code)) {
            console.error("Error. El campo codigo identificador es invalido.")
            return
        }

        const codeIndex = this.#products.findIndex(e => e.code === code)
        if (codeIndex !== -1) {
            console.error("Codigo ya existente")
            return
        }

        const product = {
            id: this.#getNuevoId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.#products.push(product)

        await this.#updateProducts()
    }

    async #updateProducts() {
        const fileProducts = JSON.stringify(this.#products, null, '\t')
        await fs.promises.writeFile(this.path, fileProducts)
    }

    updateProduct = async (id, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) => {

        const codeIndex = this.#products.findIndex(e => e.id === id);
        if (codeIndex === -1) {
            console.error("Producto con ID:" + id + " not Found");
        }
        else {
            if (newTitle !== '') {
                this.#products[codeIndex].title = newTitle;
            }            
            if (newDescription !== '') {
                this.#products[codeIndex].description = newDescription;
            }           
            if (newPrice !== '') {
                if (isNaN(newPrice)) {
                    console.error("Error. El campo precio es invalido.")
                    return
                }
                this.#products[codeIndex].price = newPrice;
            }
            if (newThumbnail !== '') {
                this.#products[codeIndex].thumbnail = newThumbnail;
            }            
            if (newCode !== '') {
                const existingCode = listadoProductos.findIndex(item => item.code === newCode);
                if (existingCode !== -1) {
                    console.error("Codigo Ya existente");
                    return;
                }
                if (!this.#soloNumYletras(newCode)) {
                    console.error("Error. El campo codigo identificador es invalido.")
                    return
                }
                this.#products[codeIndex].code = newCode;
            }
            if (newStock !== '') {
                if (isNaN(newStock)) {
                    console.error("Error. El campo stock es invalido.")
                    return
                }
                this.#products[codeIndex].stock = newStock;
            }
            await this.#updateProducts()
        }
    }

    deleteProduct = async (idProd) => {
        const product = this.#products.find(item => item.id === idProd)
        if (product) {
            this.#products = this.#products.filter(item => item.id !== idProd)
            await this.#updateProducts()
        }
        else {
            console.error(`Producto con ID: ${idProd} Not Found`)
            return
        }
    }
}

module.exports = ProductManager;