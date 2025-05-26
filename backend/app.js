const express = require("express");
const cors = require("cors");

const app = express();

const port = 3000;

app.use(express.json());
app.use(cors());

const loginRouter = require("./login");

app.use("/login", loginRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
