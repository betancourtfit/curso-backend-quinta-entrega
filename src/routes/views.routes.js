import express from "express";
import userRouter from './users.routes.js';
import productRouter from './products.routes.js';
import cartRouter from './carts.routes.js';
import messageRouter from './messages.routes.js';

const router = express.Router();

router.get('/static', (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "home.css",
        title: "Chat",
        
    });
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "Products",
        js: "realTimeProducts.js"

    })
})

router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)
router.use('/api/message', messageRouter)

export default router;