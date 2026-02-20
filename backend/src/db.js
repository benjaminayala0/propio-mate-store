import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const config = process.env.DB_URI
  ? {
    connectionString: process.env.DB_URI,
    ssl: { rejectUnauthorized: false },
  }
  : {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  };

export const db = process.env.DB_URI
  ? new Sequelize(process.env.DB_URI, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    config
  );

export const connectDB = async () => {
  try {
    await db.authenticate();
    console.log(" Conectado a PostgreSQL correctamente");
  } catch (err) {
    console.error(" Error al conectar DB:", err);
  }
};
