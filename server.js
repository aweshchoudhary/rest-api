const express = require("express");
const app = express();
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
const connect = require("./database/connect");
const port = process.env.PORT || 80;
const appRoutes = require("./routes/app");
const errorHandling = require("./apps/errorHandling")

// Middleweare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});


// Routers
app.use("/api/user", appRoutes);


app.use(errorHandling)



// Listening
app.listen(port, () => console.log(`Server is listening on Port : ${port}`));
