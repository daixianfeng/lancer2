const dbConfig = {
    host: 'localhost',
    dialect: 'mysql',
    db: 'svs',
    user: 'root',
    password: '********',
    native: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    timezone: '+08:00',
}
export default dbConfig;