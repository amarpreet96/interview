const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8080;

//Creating db connection
connectDB();

//INIT Middlewares
app.use(express.json({extended:false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//default route
app.get("/", (req, res) => {
  res.send("App is running");
});

app.use("/api/user", require("./controllers/user"));

app.get("*",(req,res)=>{
    res.status(404).send("not found");
});

//app listening on defined port
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

module.exports = app;