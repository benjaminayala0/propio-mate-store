import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// IMPORTAR TODAS LAS RUTAS
import testRoutes from "./src/routes/test.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import couponRoutes from "./src/routes/coupon.routes.js";
import shippingRoutes from "./src/routes/shipping.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import domicilioRoutes from "./src/routes/domicilio.routes.js";
import checkoutRoutes from "./src/routes/checkout.routes.js";
import orderRoutes from "./src/routes/order.routes.js";

//  Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB
import { connectDB } from "./src/db.js";

// CONFIG
dotenv.config();
connectDB();

const app = express();
// Render corre detrás de un proxy reverso: necesario para que express-rate-limit
// pueda leer la IP real del cliente desde el header X-Forwarded-For
app.set("trust proxy", 1);

// CORS CONFIG 
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  "https://propio-mate-store.vercel.app",
  "https://mate-unico-store.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean); // elimina cualquier undefined de env vars no seteadas

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ ORIGEN BLOQUEADO POR CORS:", origin);
      return callback(new Error("No permitido por CORS"), false);
    },
    credentials: true,
  })
);

// 🛡️ HELMET: cabeceras de seguridad HTTP
app.use(helmet());

// 🚫 RATE LIMITING: máx 100 reqs por IP cada 15 minutos para la API general
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones, intentá de nuevo en 15 minutos" },
});

// Límite más estricto para el endpoint de autenticación: 10 intentos por 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de login, intentá en 15 minutos" },
});

app.use(express.json());

// RUTAS
app.get("/", (req, res) => {
  res.send("API Mate Unico funcionando");
});

// ENDPOINT DE MANTENIMIENTO: Evita que Render apague los servidores (Cold Start)
app.get("/api/health", async (req, res) => {
  try {
    // 1. Backend activo 
    const backendStatus = "🟢 OK";

    // 2. Micro-Ping a Strapi para que tampoco se duerma
    const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || "http://localhost:1337";
    await import('axios').then(axios => axios.default.get(STRAPI_BASE_URL + "/api/productos?pagination[limit]=1", { timeout: 5000 }));

    const strapiStatus = "🟢 OK";

    res.json({
      status: "Activo",
      backend: backendStatus,
      strapi: strapiStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("⚠️ Strapi dormido durante el Health Check", error.message);
    res.json({
      status: "Activo",
      backend: "🟢 OK",
      strapi: "🔴 DURMIENDO O CAÍDO",
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/productos", apiLimiter, productRoutes);
app.use("/api/cart", apiLimiter, cartRoutes);
app.use("/api/coupons", apiLimiter, couponRoutes);
app.use("/api/shipping", apiLimiter, shippingRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/reviews", apiLimiter, reviewRoutes);
app.use("/api/test", testRoutes);
app.use("/api/usuarios", apiLimiter, userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/domicilio", domicilioRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));