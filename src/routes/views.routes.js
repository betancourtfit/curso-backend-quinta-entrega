import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "home.css",
        title: "Chat",
        
    });
})

export default router;