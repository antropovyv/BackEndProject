const { sign } = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
// Официальный пример из документации:
const knex = require("knex");
const db = knex({
  //postgresql
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "antyar",
    password: "",
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json(database.users);
});

app;
app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          });
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Unable to get user"));
});

app.post("/register", (req, res) => {
  // Load hash from your password DB.
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((LoginEmail) =>
        trx("users")
          .returning("*")
          .insert({
            email: LoginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback)
      )
      .catch((err) => res.status(400).json("Unalble to register"));
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      // ← исправлено на users
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => {
      res.status(400).json("Error getting user");
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("enable to get entries"));
});

app.listen(3000, () => {
  console.log("application is start");
});

/*
/signin --> POST (SUCCESS of FAIL )
/register --> POST = user
/profile/:userId --> GET = user
/image -->PUT--> user
*/
