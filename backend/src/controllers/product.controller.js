import axios from "axios";
import NodeCache from "node-cache";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337/api/productos";
const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || "http://localhost:1337";

// Cache configurado para guardar en memoria por 5 minutos (300 segundos)
const productCache = new NodeCache({ stdTTL: 300 });

// GET ALL PRODUCTS

export const getAllProducts = async (req, res) => {
  try {
    // 1. Revisar si tenemos los productos en la memoria caché RAM
    const cachedProducts = productCache.get("allProducts");
    if (cachedProducts) {
      console.log("⚡ Productos servidos desde Caché en RAM (0.01ms)");
      return res.json(cachedProducts);
    }

    // 2. Si NO están en caché, viajamos por internet hacia Strapi
    console.log("⏳ Descargando catálogo desde Strapi Nube...");
    const response = await axios.get(STRAPI_URL + "?populate=*");
    const productosRaw = response.data.data;

    const productos = productosRaw.map((item) => {
      let imagen = null;
      if (Array.isArray(item.imagen) && item.imagen.length > 0) {
        const rawUrl = item.imagen[0].url;
        imagen = rawUrl.startsWith("http") ? rawUrl : STRAPI_BASE_URL + rawUrl;
      }

      return {
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        material: item.material,
        esnew: item.esnew,
        tipocombo: item.tipocombo,
        matecolor: item.matecolor,
        esta_activo: item.esta_activo,
        stock: item.stock,
        permite_grabado: item.congrabado,
        imagen,
      };
    });

    const productosActivos = productos.filter((p) => p.esta_activo === true);

    // 3. Guardar en memoria caché para los próximos visitantes
    productCache.set("allProducts", productosActivos);

    res.json(productosActivos);

  } catch (error) {
    console.error("Error obteniendo productos desde Strapi:", error.message);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
};

// GET PRODUCT BY ID

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `product_${id}`;

    // 1. Revisar Caché RAM
    const cachedProduct = productCache.get(cacheKey);
    if (cachedProduct) {
      console.log(`⚡ Producto ${id} servido desde Caché en RAM (0.01ms)`);
      return res.json(cachedProduct);
    }

    // 2. Viajar a Strapi
    console.log(`⏳ Descargando producto ${id} desde Strapi Nube...`);
    const response = await axios.get(
      `${STRAPI_URL}?filters[id][$eq]=${id}&populate=*`,
      { timeout: 15000 } // Give Strapi time to wake up if cold
    );

    const items = response.data?.data;

    if (!items || items.length === 0) {
      console.log(`❌ Producto ${id} no encontrado en Strapi.`);
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const item = items[0];

    if (!item.esta_activo) {
      console.log(`❌ Producto ${id} encontrado pero no está activo.`);
      return res.status(404).json({ error: "Producto no disponible" });
    }

    let imagen = null;
    if (Array.isArray(item.imagen) && item.imagen.length > 0) {
      const rawUrl = item.imagen[0].url;
      imagen = rawUrl.startsWith("http") ? rawUrl : STRAPI_BASE_URL + rawUrl;
    }

    const producto = {
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      descripcion: item.descripcion,
      material: item.material,
      esnew: item.esnew,
      tipocombo: item.tipocombo,
      matecolor: item.matecolor,
      esta_activo: item.esta_activo,
      stock: item.stock,
      permite_grabado: item.congrabado,
      imagen,
      relacionados: item.variantes_relacionadas || [],
    };

    // 3. Guardar en memoria caché para la próxima vez
    productCache.set(cacheKey, producto);

    res.json(producto);

  } catch (error) {
    console.error("🔥 Error obteniendo producto:", error.response?.data || error);
    res.status(500).json({ error: "Error obteniendo producto" });
  }
};
