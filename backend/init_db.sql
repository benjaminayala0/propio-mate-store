
-- 1. Tablas Base (Sin dependencias)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    google_id character varying(255),
    nombre character varying(100),
    apellido character varying(100),
    email character varying(150),
    foto character varying(255),
    bloqueado boolean DEFAULT false,
    confirmado boolean DEFAULT false,
    provider character varying(255),
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ciudad (
    codigo_postal INTEGER NOT NULL,
    nombre character varying(50) NOT NULL,
    PRIMARY KEY (codigo_postal)
);

CREATE TABLE IF NOT EXISTS public.cupons (
    id SERIAL PRIMARY KEY,
    codigo character varying(255),
    porcentaje integer,
    activo boolean DEFAULT true,
    document_id character varying(255)
);

CREATE TABLE IF NOT EXISTS public.productos (
    id SERIAL PRIMARY KEY,
    nombre character varying(255),
    descripcion text,
    precio bigint,
    matecolor character varying(255),
    stock integer,
    esta_activo boolean DEFAULT true,
    esnew boolean,
    congrabado boolean,
    material character varying(255),
    tipocombo character varying(255),
    document_id character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone
);

CREATE TABLE IF NOT EXISTS public.imagen (
    id SERIAL PRIMARY KEY,
    url character varying(250) NOT NULL,
    orden integer NOT NULL
);

-- 2. Tablas con Dependencias Simples
CREATE TABLE IF NOT EXISTS public.domicilio (
    id SERIAL PRIMARY KEY,
    usuario_id integer REFERENCES public.usuarios(id),
    calle character varying(50),
    numero character varying(20),
    ciudad character varying(100),
    provincia character varying(100),
    pais character varying(100),
    codigo_postal character varying(20),
    telefono character varying(20),
    creado_en timestamp without time zone DEFAULT now()
);

CREATE TYPE public.estado_carrito AS ENUM ('activo', 'abandonado', 'cerrado', 'inactivo');

CREATE TABLE IF NOT EXISTS public.carrito (
    id SERIAL PRIMARY KEY,
    cliente_id integer REFERENCES public.usuarios(id),
    precio_total numeric(10,2) DEFAULT 0 NOT NULL,
    estado public.estado_carrito DEFAULT 'activo'::public.estado_carrito NOT NULL
);

CREATE TABLE IF NOT EXISTS public.resena (
    id SERIAL PRIMARY KEY,
    cliente_id integer REFERENCES public.usuarios(id),
    producto_id integer REFERENCES public.productos(id),
    calificacion integer NOT NULL,
    comentario character varying(300),
    permitido boolean DEFAULT false,
    fecha date NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ingreso (
    id SERIAL PRIMARY KEY,
    producto_id integer REFERENCES public.productos(id),
    cantidad_prod integer NOT NULL,
    fecha date NOT NULL
);

-- 3. Tablas Complejas (Relaciones)
CREATE TABLE IF NOT EXISTS public.item_carrito (
    id SERIAL PRIMARY KEY,
    carrito_id integer REFERENCES public.carrito(id) ON DELETE CASCADE,
    producto_id integer REFERENCES public.productos(id),
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2),
    grabado_texto character varying(120),
    costo_grabado numeric(10,2) DEFAULT 0,
    color character varying(50)
);

CREATE TYPE public.estado_pago AS ENUM ('pendiente', 'aprobado', 'rechazado', 'pagado');
CREATE TYPE public.estado_envio AS ENUM ('pendiente', 'en camino', 'entregado', 'cancelado');

CREATE TABLE IF NOT EXISTS public.orden_compra (
    id SERIAL PRIMARY KEY,
    cliente_id integer REFERENCES public.usuarios(id),
    carrito_id integer,
    monto_total numeric(10,2) NOT NULL,
    estado_pago public.estado_pago DEFAULT 'pendiente'::public.estado_pago NOT NULL,
    estado_pedido public.estado_envio DEFAULT 'pendiente'::public.estado_envio NOT NULL,
    fecha_creacion date NOT NULL,
    pago_id text,
    direccion_envio character varying(200),
    ciudad_envio character varying(100),
    provincia_envio character varying(100),
    pais_envio character varying(100),
    codigo_postal_envio character varying(20),
    domicilio_id integer
);

CREATE TABLE IF NOT EXISTS public.linea_compra (
    id SERIAL PRIMARY KEY,
    orden_id integer REFERENCES public.orden_compra(id),
    producto_id integer REFERENCES public.productos(id),
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2),
    grabado_texto character varying(120),
    costo_grabado numeric(10,2)
);

CREATE TABLE IF NOT EXISTS public.cuponusados (
    id SERIAL PRIMARY KEY,
    cliente_id integer REFERENCES public.usuarios(id),
    cupon_id integer REFERENCES public.cupons(id),
    pedido_id integer,
    document_id character varying(255),
    created_at timestamp(6) without time zone DEFAULT now()
);
