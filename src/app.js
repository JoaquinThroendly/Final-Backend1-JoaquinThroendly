import express from 'express';
import { engine } from "express-handlebars";
import { router as productsRouter } from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/cartsRouter.js';
import { router as vistasRouter } from './routes/vistasRouter.js';

import mongoose from 'mongoose';

const PORT = 8081;

const app = express();

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contenido estático
app.use(express.static("./src/public"));

// Configuración de express-handlebars
app.engine("handlebars", engine({
    layoutsDir: './src/views/layouts',
    defaultLayout: "main" // Asegúrate de tener un archivo llamado `main.handlebars` en la carpeta `layouts`
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/", vistasRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicializar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Conexión a MongoDB Atlas
(async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://joaquinthroendlydeveloper:royale40@cluster0.8d6bs.mongodb.net/Final_Backend_",
            { dbName: "Final_Backend_BD" }  // Eliminamos las opciones deprecated
        );
        console.log("Conexión exitosa a MongoDB Atlas");
    } catch (error) {
        console.error("Error al conectar con MongoDB Atlas:", error.message);
        process.exit(1); // Salir si hay un error
    }
    
})();
