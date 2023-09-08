import { Router } from "express"
import { cartModel } from "../dao/models/carts.models.js"
import { productModel } from "../dao/models/products.models.js"

const cartRouter = Router()

cartRouter.get('/', async (req, res) => {
    const {limit} = req.query
    try {
        const carts = await cartModel.find().limit(limit);
        res.status(200).send({respuesta: 'ok', mensaje: carts})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

cartRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const cart = await cartModel.findById(id);
        if (cart)
            res.status(200).send({respuesta: 'ok', mensaje: cart})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'Product not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error getting cart by id', mensaje: error})
    }
})

cartRouter.post('/', async (req, res) => {
    try {
        const respuesta = await cartModel.create({});
        res.status(200).send({respuesta: 'OK cart created', mensaje: respuesta})
    } catch (error){
        res.status(400).send({respuesta: 'Error at cart creation', mensaje: error})
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) =>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    
    try{
        const cart =  await cartModel.findById(cid);
        if(cart){
            const prod = await productModel.findById(pid);
            if(prod){
                const indice = cart.products.findIndex(prod => prod.id_prod.toString() === pid)
                if(indice != -1) {
                    cart.products[indice].quantity = quantity
                } else {
                    cart.products.push({id_prod: pid, quantity: quantity})
                }
                await cart.save();
                res.status(200).send({respuesta:'OK', mensaje:'Cart Updated'})
            } else{
                res.status(404).send({respuesta:'Error', mensaje:'product not found'})
            }    
        }else {
            res.status(404).send({respuesta:'Error', mensaje:'cart nor found'})
        }

    } catch(error) {
        res.status(400).send({respuesta: 'Error updating cart', mensaje: error})
    }

})

export default cartRouter