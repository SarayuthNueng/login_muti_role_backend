// connect db by sequelize+mysql
import { Sequelize } from "sequelize";

const db = new Sequelize('auth_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;