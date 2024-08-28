require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const routes = require("./routes/routes");


const app = express();
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

  
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to the database"));


app.use(
    session({
      secret: "e-Conestoga",
      saveUninitialized: true,
      resave: false,
    })
  );


  app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message, next();
  });
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  
  // app.set("views", path.join(__dirname, "views"));
  
  app.use(express.static(__dirname + "/public"));
  
  app.set("view engine", "ejs");
  
  app.use("", routes);

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`App running on port : ${PORT}`);
  });