import mongoose from "mongoose";

import  paginate  from "mongoose-paginate-v2";

const productsEsquema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        code: {
            type: String,
            unique: true,
            required: [true, 'El campo "code" es obligatorio.']
        },
        price: { type: String, required: true },
        stock: { type: String, default: 0 },
        category: { type: String, required: true },
        thumbnails: { type: Array, default: [] }
    },
    { collection: 'productos' }
);


productsEsquema.plugin(paginate);


export const productsModelo = mongoose.model('productos', productsEsquema);