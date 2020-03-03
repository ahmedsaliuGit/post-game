const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

dotenv.config();
const app = express();
// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected"));

mongoose.connection.on("error", error => {
  console.log(`Database connection failed: ${error.message}`);
});

// bring in routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

app.get("/", (req, res) => res.send("Docs coming soon"));
app.use("/api", postRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`NodeJS APIs App. Listening on port: ${port}`)
);
