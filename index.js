const express = require("express");
const { engine } = require("express-handlebars");
const myconnection = require("express-myconnection");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const ejs = require('ejs');
const { body, validationResult } = require("express-validator");
const pPath = path.resolve(__dirname, "public");



dotenv.config({ path: "./env/.env" });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("port", 3000);
app.listen(process.env.PORT || 3000, () => { console.log("server activo") });

//asdjasdiashdiuhqiwehqwiehqwyrguygqweu
app.set("view engine", "ejs");

app.use(session({
   secret: "secret",
   resave: true,
   saveUninitialized: true
}));

const connection = require("./database/db");


app.get("/", (req, res) => {
   ejs.renderFile(`./public/index.html`, {}, function (err, str) {
      if (err) {
         res.statusCode = 500;
         res.json({ err })
      } else {
         res.send(str);
      }
   });
});

app.get("/login", (req, res) => {
   res.sendFile(`${__dirname}/public/login.html`);
});

app.post('/login', async (req, res) => {
   const { email, pass } = req.body;
   connection.query(`SELECT * FROM usuarios WHERE email = "${email}"`,
      async function (err, resultado) {
         if (err) {
            res.json({ error: true });
         } else {
            if (resultado.length > 0) {
               const hashedPassword = resultado[0].pass;
               const plainPassword = pass;
               const passwordResult = await bcrypt.compare(plainPassword, hashedPassword);
               console.log(passwordResult);
               if (passwordResult) {
                  res.json({ message: "Exitoso!", error: false, name: resultado[0].name });
               } else {
                  res.json({ message: "Contraseña es incorrecta!", error: true });
               }
            } else {
               res.json({ message: "El usuario no existe!", error: true });
            }
         }
      });
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

app.post("/registro", [
   body("user", "ingrese su nombre (minimo 3 caracteres)")
      .exists()
      .isLength({ min: 3 }),
   body("lastname", "ingrese su apellido (minimo 3 caracteres)")
      .exists()
      .isLength({ min: 3 }),
   body("email", "ingrese su correo electronico")
      .exists()
      .isEmail(),
   body("pass", "ingrese su correo electronico")
      .exists(),
], async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { email, user, lastname, pass } = req.body;
      const passwordEncrypted = await bcrypt.hash(pass, 10);
      connection.query(`INSERT INTO usuarios(name, lastname, email, pass) VALUES ("${user}", "${lastname}", "${email}", "${passwordEncrypted}")`,
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
app.use(express.static('public'));