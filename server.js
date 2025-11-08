const { sign } = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();

app.use(bodyParser.json());

const database = {
  users: [
    {
      id: "0",
      name: "Antropov Yaroslav",
      email: "antropovyv@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1",
      name: "UnName",
      email: "UnName@antropovyv@gamil.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "0",
      hash: "$2b$10$slfKI.z3rV9RGzzhaE8zJei8ZHb8kDWIz4eb3HeA83ozoBbXTcRt",
      email: "antropovyv@gamil.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "apples",
    "$2b$10$slfKI.z3rV9RGzzhaE8zJei8ZHb8kDWIz4eb3HeA83ozoBbXTcRt",
    function (err, result) {
      // result == true
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "antropov",
    "$2b$10$slfKI.z3rV9RGzzhaE8zJei8ZHb8kDWIz4eb3HeA83ozoBbXTcRt",
    function (err, result) {
      // result == false

      console.log("second guess", res);
    }
  );

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
  const { email, name, password } = req.body;
  //console.log("Привет");
  saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });

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

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    return res.status(404).json("no such user");
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;

  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    return res.status(404).json("no such user");
  }
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
