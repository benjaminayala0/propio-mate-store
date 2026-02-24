import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary con las mismas variables que usa Strapi
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Sube un buffer de imagen a Cloudinary y devuelve la URL pública.
 * @param {Buffer} buffer - Contenido del archivo en memoria
 * @param {string} publicId - Nombre del archivo en Cloudinary (sin extensión)
 * @returns {Promise<string>} URL segura de la imagen en Cloudinary
 */
export const subirFotoCloudinary = (buffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "usuarios",       // Carpeta separada de las fotos de Strapi
                public_id: publicId,
                overwrite: true,          // Sobrescribe si ya existe (útil al actualizar)
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // URL HTTPS permanente de Cloudinary
            }
        ).end(buffer);
    });
};

/**
 * Elimina una imagen de Cloudinary dado su public_id
 * @param {string} publicId - ID público (ej: "usuarios/user_4")
 */
export const eliminarFotoCloudinary = (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
