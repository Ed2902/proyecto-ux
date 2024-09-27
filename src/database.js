import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',  // Docker está corriendo MySQL en localhost
  port: '3306',       // El puerto que mapeamos es 3306
  user: 'usuario',    // El usuario que definimos en docker-compose.yml
  password: 'contrasena',  // La contraseña que definimos en docker-compose.yml
  database: 'viatge_bd'  // Nombre de la base de datos que configuraste
});

export default pool;
