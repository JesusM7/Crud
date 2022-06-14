const mysql = require ("mysql");

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((error) => {
    if(error){
        console.log("ERRRRRORR " +error);
        return;
    }
console.log("conectado a la base de datos!!")
});

module.exports = connection;