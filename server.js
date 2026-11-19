const pool = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();

const port = 3001;
app.listen(port, () => console.log(`Sevidor escucha ${port}`));

app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);
app.use(express.json());

async function connectDB() {
  try {
    const resultado = await pool.query('SELECT * FROM productos');
    return resultado.rows;
  } catch (error) {
    throw error;
  }
}

app.get('/productos', async (req, res) => {
  try {
    res.send(await connectDB());
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});

async function connectDBid(reqs) {
  try {
    const resultado = await pool.query('SELECT * FROM Productos WHERE id_producto = $1', [reqs]);
    return resultado.rows[0];
  } catch (error) {
    throw error;
  }
}

app.get('/productos/:id', async (req, res) => {
  try {
    const respuesta = req.params.id;
    res.send(await connectDBid(respuesta));
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});

async function connectDBPost(nombre, descripcion, precio, stock, stock_minimo, id_categoria) {
  try {
    const resultado = await pool.query(
      'INSERT INTO productos( nombre, descripcion, precio, stock,stock_minimo, id_categoria) VALUES ($1,$2,$3,$4,$5,$6) RETURNING*;',
      [nombre, descripcion, precio, stock, stock_minimo, id_categoria],
    );
    return resultado.rows[0];
  } catch (error) {
    throw error;
  }
}

app.post('/productos', async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const stock = req.body.stock;
    const stock_minimo = req.body.stock_minimo;
    const id_categoria = req.body.id_categoria;
    res.send(await connectDBPost(nombre, descripcion, precio, stock, stock_minimo, id_categoria));
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});
