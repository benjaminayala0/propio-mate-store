export default ({ env }) => {
  const connectionUrl = env("DATABASE_URL");

  let connectionConfig = {};

  if (connectionUrl) {
    connectionConfig = {
      client: "postgres",
      connection: {
        connectionString: connectionUrl,
        ssl: { rejectUnauthorized: false },
      },
    };
  } else {
    connectionConfig = {
      client: "postgres",
      connection: {
        host: env("DB_HOST", "127.0.0.1"),
        port: env.int("DB_PORT", 5432),
        database: env("DB_NAME", "mate_unico"),
        user: env("DB_USER", "soporte"),
        password: env("DB_PASSWORD", "123"),
        ssl: false,
      },
    };
  }

  return {
    connection: connectionConfig,
  };
};
