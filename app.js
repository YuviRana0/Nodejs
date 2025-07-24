const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const indexRouter = require('./routes/index.routes');

dotenv.config();
connectDB();
app.use(cookieParser());

app.use("/", indexRouter);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});