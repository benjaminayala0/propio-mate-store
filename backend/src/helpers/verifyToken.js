import jwt from "jsonwebtoken";

/**
 * Middleware: verifica que la petición incluya un JWT válido en el header Authorization.
 * Uso: agregar como segundo argumento en cualquier route que requiera autenticación.
 *
 * Ejemplo: router.get("/:id/historial", verifyToken, getHistorialUsuario);
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso no autorizado: token ausente" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // El payload del token queda disponible en req.user
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};
