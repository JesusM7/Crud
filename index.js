const express = require("express");
const { engine } = require("express-handlebars");
const myconnection = require("express-myconnection");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const ejs = require('ejs');

dotenv.config({ path: "./env/.env" });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("port", 3000);
app.listen(3000, () => { console.log("server activo") });

//asdjasdiashdiuhqiwehqwiehqwyrguygqweu
app.set("view engine", "ejs");

app.use(session({
   secret: "secret",
   resave: true,
   saveUninitialized: true
}));

const connection = require("./database/db");
app.use(express.static('public'));

app.get("/", (req, res) => {
   res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/editar/:id", (req, res) => {
   connection.query(`SELECT id, name, lastname, email FROM usuarios where id = ${req.params.id}`,
      function (err, resultado) {
         if (err) {
            res.statusCode = 500;
            res.json({ err })
            console.log("nosirve" + err);
         } else {
            if (resultado.length > 0) {
               ejs.renderFile(`./public/editar.html`, resultado[0], function (err, str) {
                  if (err) {
                     res.statusCode = 500;
                     res.json({ err })
                  } else {
                     res.send(str);
                  }
               });
            } else {
               res.sendFile(`${__dirname}/public/index.html`);
            }
         }
      });
});

app.patch("/usuarios/:id", (req, res) => {
   const id = req.params.id;
   const data = req.body;
   connection.query(`UPDATE usuarios SET name = "${data.name}", email = "${data.email}", lastname = "${data.lastname}" where id = ${id}`,
      function (err, resultado) {
         if (err) {
            res.statusCode = 500
            res.json({ err })
         } else {
            console.log(resultado);
            res.json(resultado)
         }
      });
});

app.get("/registro", (req, res) => {
   res.sendFile(`${__dirname}/public/registro.html`);
});

app.post("/registro", async (req, res) => {
   try {
      const { email, user, lastname } = req.body;
      connection.query(`INSERT INTO usuarios(name, lastname, email) VALUES ("${user}", "${lastname}", "${email}")`,
         function (err, resultado) {
            if (!err) {
               res.statusCode = 200;
               res.json({ message: "Guardado!", error: false });
            } else {
               res.statusCode = 500;
               res.json({ message: "Ocurrio un error", error: true });
            }
         });

   } catch (error) {
      console.error(error)
      res.statusCode = 500;
      res.json(error)
   }
});
app.get("/usuarios", (req, res) => {
   connection.query(`SELECT id, name, lastname, email FROM usuarios `,
      function (err, resultado) {
         if (err) {
            console.log("nosirve" + err);
         } else {
            res.json(resultado)
         }
      });
});

app.delete("/usuarios/:id", (req, res) => {
   connection.query(`DELETE FROM usuarios where usuarios.id = ${req.params.id}`, function (err, resultado) {
      if (err) {
         console.log("nosirve" + err);
         res.statusCode = 500;
         res.json({ err })
      } else {
         res.json(resultado)
      }
   })
});