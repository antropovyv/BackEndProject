const { sign } = require("crypto");
const express = require("express");
const bodyParcer = require("body-parser");

const app = express();

app.use(bodyParcer.json());

const database = {
  users: [
    {
      id: "0",
      name: "Antropov Yaroslav",
      email: "antropovyv@gamil.com",
      password: "Antropov",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1",
      name: "UnName",
      email: "UnName@antropovyv@gamil.com",
      password: "Unname",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("SUCCESS");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: "0",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});
/*
/signin --> POST (SUCCESS of FAIL )
/register --> POST = user
/profile/:userId --> GET = user
/image -->PUT--> user
*/

app.listen(3000, () => {
  console.log("application is start");
});
