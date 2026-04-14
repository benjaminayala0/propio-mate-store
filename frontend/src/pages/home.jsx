import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/home/hero-mates.jpeg";
import hero1Img from "../assets/home/hero-mates1.jpeg";
import hero2Img from "../assets/home/Hero-mates2.jpeg";
import combosImg from "../assets/home/combos.jpeg";
import productosImg from "../assets/home/productos.jpeg";
import newsletterBg from "../assets/home/newsletter-bg.jpeg";
import iconTruck from "../assets/home/icon-truck.png";
import iconLock from "../assets/home/icon-lock.png";
import iconSupport from "../assets/home/support.png";

//COMPONENTE DE ESTRELLAS

function Stars({ value }) {
  const rounded = Math.round(value || 0);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rounded ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }
  return <span className="text-lg">{stars}</span>;
}

export default function Home() {

  const navigate = useNavigate();

  // SLIDER 
  const slides = [
    { url: heroImg, title: "Set de mates" },
    { url: hero1Img, title: "Set de mates 1" },
    { url: hero2Img, title: "Set de mates 2" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? slides.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    async function loadNewProducts() {
      try {
        //  VITE_API_URL en lugar de localhost fijo
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();

        // 1. Filtramos primero los que son "Nuevos"
        const candidatos = data.filter((p) => p.esnew === true).slice(0, 3);

        // 2. Buscamos el rating real de cada uno
        const itemsConRating = await Promise.all(
          candidatos.map(async (item) => {
            let avg = 0;
            try {
              const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
              const r = await fetch(`${API_URL}/api/reviews/product/${item.id}`);
              const rData = await r.json();
              avg = rData.averageRating || 0;
            } catch { }

            return {
              id: item.id,
              nombre: item.nombre,
              precio: item.precio,
              esNuevo: item.esnew,
              imagen: item.imagen,
              rating: avg,
              tipocombo: item.tipocombo,
            };
          })
        );

        setNewProducts(itemsConRating);

      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }

    loadNewProducts();
  }, []);


  // FEATURES 
  const features = [
    {
      id: 1,
      icon: iconTruck,
      title: "Envio Gratis",
      description: "A partir de $150.000",
    },
    {
      id: 2,
      icon: iconLock,
      title: "Compra Protegida",
      description: "Seguro by Mercado Pago",
    },
    {
      id: 3,
      icon: iconSupport,
      title: "24/7 Soporte",
      description: "Solo por número de teléfono",
    },
  ];

  return (
    <div className="bg-white">

      {/* SLIDER */}
      <section className="max-w-6xl mx-auto px-4 pt-10 relative group">

        {/* CONTENEDOR DE IMAGEN RESPONSIVE */}
        <div className="w-full aspect-[4/2.9] sm:aspect-video lg:h-[500px] lg:aspect-auto rounded-md overflow-hidden bg-[#f3f5f6] flex items-center justify-center relative z-0">
          <img
            src={slides[currentIndex].url}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover object-center duration-500 scale-100"
          />
        </div>

        {/* FLECHA IZQUIERDA */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-6 md:left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 outline-none pointer-events-auto"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* FLECHA DERECHA */}
        <button
          className="absolute top-1/2 -translate-y-1/2 right-6 md:right-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 outline-none pointer-events-auto"
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* PUNTITOS */}
        <div className="flex justify-center py-2 mt-4 gap-2 relative z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Ir a la diapositiva ${idx + 1}`}
              className={`cursor-pointer rounded-full transition-all duration-300 py-1 ${currentIndex === idx
                ? "bg-[#8B5E3C] w-8 h-2"
                : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                }`}
            ></button>
          ))}
        </div>
      </section>

      {/* TITULAR */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-black">
          Simple Unico/
          <br />
          Simple Mejor.
        </h1>
        <p className="text-black text-base md:text-lg self-center">
          Mate Único es una tienda online argentina especializada en mates artesanales y accesorios.
        </p>
      </section>

      {/* COMBOS + PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* COMBOS */}
        <div>
          <h2 className="text-black text-2xl font-semibold">Combos</h2>
          <button
            className="mt-4 px-6 py-2.5 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 active:scale-95 transition-all relative z-10"
            onClick={() => navigate("/productos?combo=true")}
          >
            Compra Ahora →
          </button>
          <div className="w-full aspect-video sm:aspect-square md:h-[320px] md:aspect-auto mt-4 rounded-md overflow-hidden">
            <img src={combosImg} className="w-full h-full object-cover" alt="Combos" />
          </div>
        </div>

        {/* PRODUCTOS */}
        <div>
          <h2 className="text-black text-2xl font-semibold">Productos</h2>
          <button
            className="mt-4 px-6 py-2.5 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 active:scale-95 transition-all relative z-10"
            onClick={() => navigate("/productos")}
          >
            Compra Ahora →
          </button>
          <div className="w-full aspect-video sm:aspect-square md:h-[320px] md:aspect-auto mt-4 rounded-md overflow-hidden">
            <img src={productosImg} className="w-full h-full object-cover" alt="Productos" />
          </div>
        </div>

      </section>

      {/* RECIÉN LLEGADOS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">

        <div className="flex items-end justify-between mb-6">
          <h2 className="text-black text-3xl font-semibold leading-tight">
            Recién<br />Llegados
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {newProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col cursor-pointer"
              onClick={() => navigate(`/producto/${product.id}`)}
            >
              <div className="relative">
                <div className="w-full aspect-square bg-[#f3f5f6] rounded-md overflow-hidden flex items-center justify-center">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* BADGE NUEVO */}
                {product.esNuevo === true && (
                  <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
                    NUEVO
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-1">
                {/* Rating Dinámico */}
                <div className="flex items-center gap-2">
                  <Stars value={product.rating} />
                  <span className="text-xs text-gray-500">({product.rating?.toFixed(1) || 0})</span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900">{product.nombre}</h3>
                <p className="text-sm text-gray-800">${product.precio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feat) => (
            <article key={feat.id} className="bg-[#f3f5f6] rounded-md px-8 py-10">
              <img src={feat.icon} alt={feat.title} className="h-10 w-10 mb-2" />
              <h3 className="text-lg font-semibold">{feat.title}</h3>
              <p className="text-sm text-gray-500">{feat.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="w-full">
        <div className="relative max-w-6xl mx-auto px-4 pb-20">
          <div className="rounded-md overflow-hidden h-[360px] sm:h-[300px] lg:h-[320px] relative">
            <img src={newsletterBg} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
              <h2 className="text-2xl md:text-3xl text-white mb-3 font-medium">
                Suscríbete a nuestro boletín informativo
              </h2>
              <p className="text-sm md:text-base text-gray-100 mb-5 max-w-xl">
                Regístrate para recibir ofertas, nuevos productos y promociones.
              </p>

              <form className="flex flex-col md:flex-row gap-3 w-full max-w-md pointer-events-auto">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 rounded-md border bg-white/90"
                />
                <button className="px-6 py-2 rounded-md bg-black text-white">
                  Inscribirse
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

