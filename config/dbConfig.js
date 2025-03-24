const sql = require('mssql');

// Database configuration
const dbConfig = {
    user: 'sa',
    password: 'arch22',
    server: 'localhost',
    database: 'Zadies',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Export the configuration
module.exports = dbConfig;
