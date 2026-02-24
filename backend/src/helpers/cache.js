import NodeCache from "node-cache";

// Singleton: Una sola instancia de caché compartida por toda la aplicación.
// 5 minutos de TTL (300 segundos).
// Clave "allProducts" → array de todos los productos
// Clave "product_${id}" → un producto individual
const productCache = new NodeCache({ stdTTL: 300 });

export default productCache;
