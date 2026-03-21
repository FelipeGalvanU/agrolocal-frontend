const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// --- MODELO DE DATOS ---
const VendedorSchema = new mongoose.Schema({
    nombre:     String,
    email:      { type: String, unique: true, required: true },
    password:   { type: String, required: true },
    productos:  String,
    whatsapp:   String,
    ubicacion:  String,
    encargado:  String,
    foto_granja: String
});

const Vendedor = mongoose.model('Vendedor', VendedorSchema);

// --- 1. Registro de nuevo vendedor ---
router.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password, productos, whatsapp } = req.body;
        const nuevoVendedor = new Vendedor({ nombre, email, password, productos, whatsapp });
        await nuevoVendedor.save();
        res.status(200).json({ message: "Vendedor registrado con éxito" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al registrar: El correo ya existe o faltan datos." });
    }
});

// --- 2. Login de vendedor ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Vendedor.findOne({ email, password });

        if (user) {
            res.status(200).json({
                message: "Login exitoso",
                user: {
                    id:        user._id,
                    nombre:    user.nombre,
                    email:     user.email,
                    productos: user.productos,
                    ubicacion: user.ubicacion,
                    whatsapp:  user.whatsapp,
                    encargado: user.encargado
                }
            });
        } else {
            res.status(401).json({ message: "Credenciales incorrectas" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// --- 3. Actualizar perfil ---
router.post('/actualizar-perfil', async (req, res) => {
    try {
        const { email, productos, ubicacion, whatsapp, encargado, foto_granja } = req.body;
        const update = { productos, ubicacion, whatsapp, encargado, foto_granja };
        await Vendedor.findOneAndUpdate({ email }, update);
        res.status(200).json({ message: "Perfil actualizado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al actualizar perfil" });
    }
});

// --- 4. Obtener todos los vendedores (catálogo público) ---
router.get('/vendedores', async (req, res) => {
    try {
        const vendedores = await Vendedor.find(
            {},
            'nombre productos ubicacion whatsapp encargado foto_granja'
        );
        res.status(200).json(vendedores);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener vendedores" });
    }
});

module.exports = router;
