const express = require('express');
const app = express();
const morgan = require('morgan');
const boodyParser = require('body-parser');
const mongoose = require('mongoose');


const produtRouts = require('./api/routes/products');
const orderRouts = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

const bodyParser = require('body-parser');

const pwd = process.env.MONGODB_ATLAS_PW;
const uri = 'mongodb+srv://kumardevsingh:devanju@nodedev.igsft.mongodb.net/products?retryWrites=true&w=majority';

mongoose.set('useCreateIndex', true)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (res) => {
    console.log("connection done!!")
    console.log(res);
})

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(boodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


/* CORS Handling */
app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Header', 'Origin, X-Requsted-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Controll-Allow-Methods', 'PUT,POST, DELETE, PATCH, GET');
        return res.status(200).json({})

    }
    next()
})

app.use('/products', produtRouts);
app.use('/orders', orderRouts);
app.use('/user', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

})


module.exports = app;  