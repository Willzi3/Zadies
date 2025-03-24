// Import the express
const express = require('express');
// Import bodyParser
const bodyParser = require('body-parser');
// Import the userRoutes
const userRoutes = require('./routes/userRoute'); 
// Import the homeRoutes
const homeRoutes = require('./routes/homeRoute'); 
//Import productRoute
const productRoutes = require('./routes/productRoute');
//Import authRoute
// const authRoutes = require('./routes/authRoute')

const app = express();

app.use(bodyParser.json());

//authRoute api path
// app.use('/auth', authRoutes)

//homeRoute api path
app.use('/signup', homeRoutes)

//productRoute api path
app.use("/products", productRoutes)

//UsersRoute api path
app.use('/users', userRoutes)

module.exports = app;