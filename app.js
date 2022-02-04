const express = require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const tasks = require("./routes/task");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.use(function (req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,Content-Type, Date, X-Api-Version"
  );
  next();
});

app.use("/tasks/", tasks);


app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

