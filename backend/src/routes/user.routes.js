import { Router } from "express";
import multer from "multer";
import { actualizarUsuario, eliminarFoto } from "../controllers/usuario.controller.js";
import Usuario from "../models/usuario.model.js";
import { getHistorialUsuario } from "../controllers/order.controller.js";
import { verifyToken } from "../helpers/verifyToken.js";
import { subirFotoCloudinary } from "../helpers/cloudinary.js";

const router = Router();

// MULTER EN MEMORIA (no guarda en disco, el buffer va directo a Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// ACTUALIZAR CAMPOS NORMALES
router.put("/:id", verifyToken, actualizarUsuario);

// ACTUALIZAR FOTO → sube a Cloudinary y guarda la URL en la DB
router.patch("/:id/foto", verifyToken, upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ninguna imagen" });
    }

    // Subir a Cloudinary en la carpeta "usuarios", con ID único por usuario
    const publicId = `user_${req.params.id}`;
    const urlCloudinary = await subirFotoCloudinary(req.file.buffer, publicId);

    // Guardar la URL pública de Cloudinary en la base de datos
    await Usuario.update(
      { foto: urlCloudinary },
      { where: { id: req.params.id } }
    );

    return res.json({ foto: urlCloudinary });
  } catch (error) {
    console.error("Error al subir foto a Cloudinary:", error);
    res.status(500).json({ error: "Error al actualizar foto" });
  }
});

// ELIMINAR FOTO
router.delete("/:id/foto", verifyToken, eliminarFoto);

// HISTORIAL DE COMPRAS
router.get("/:id/historial", verifyToken, getHistorialUsuario);

export default router;
