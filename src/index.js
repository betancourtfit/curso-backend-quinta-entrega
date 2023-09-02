import express from 'express'
import userRouter from './routes/users.routes.js'
import mongoose from 'mongoose'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import messageRouter from './routes/messages.routes.js'
import dotenv from 'dotenv';

dotenv.config();


const app = express()
const PORT = 4000

mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/message', messageRouter)

app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})
