//node_module
import express from 'express'
import mongoose from 'mongoose'
import { engine } from 'express-handlebars';
import { Server }  from 'socket.io'
import dotenv from 'dotenv';

//Importacion de rutas
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import messageRouter from './routes/messages.routes.js'
import router from './routes/views.routes.js'

//Importacion de otros modulo
import { __dirname } from './path.js';
import { messageModel } from "./models/messages.models.js"
import path from 'path';

//Setup inicial
const viewsRouter = router;
dotenv.config();
const app = express()
const PORT = 4000


const server =  app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})

// conexion a la base de datos de mongodb
mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
// app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))

// Server de socket.io
const io = new Server(server);

io.on('connection', (socket)=> {
    console.log('servidor de socket io conectado')

    socket.on('add-message', async ({email, mensaje}) => {
        console.log(mensaje)
        await messageModel.create({email: email, message: mensaje})
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('display-inicial', async() =>{
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })
})

app.use('/',viewsRouter)


app.get('/static', (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "chat",
        js: "chat.js",
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID

    })
})

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/message', messageRouter)


