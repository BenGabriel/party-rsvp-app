const express = require("express");
const cors = require("cors");

//mongobd connection
const connectDB = require("./config/db");
connectDB();
//setUp express
const app = express();

app.use(express.json({ extended: true }));
app.use(cors());

//routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/guests", require("./routes/guests"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server Created"));
