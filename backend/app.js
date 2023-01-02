const express = require("express");
var cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cors());

dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());

// nannmetaiwyvvlzj

const PORT = process.env.PORT || 3004;
const connect = require("./connections/connection");
const Auth = require("./routes/Auth/Auth");
const Data = require("./routes/estation_data/Data");

app.use("/api/auth", Auth);
app.use("/api/estationdata", Data);

app.get("/", (req, res) => {
  res.send("api is running...");
});

connect();
const server = app.listen(PORT, () => {
  console.log(`Example app listing at /:${PORT}`);
});
