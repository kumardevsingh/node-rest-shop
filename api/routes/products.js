const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../modals/product');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'from products get function'
    })
});

router.post('/', (req, res, next) => {
    /* const product = {
        name: req.body.name,
        price: req.body.price
    } */
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price

    });
    product.save().then((result) => {
        res.status(201).json({
            message: 'a new product created',
            createdProduct: product
        })
        console.log(result)

    }).catch(error => console.error(error))



})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log(id)
    Product.findById(id)

        .then(doc => {
            console.log(doc);
            res.status(200).json(doc)

        })
        .catch(err => {
            console.error(error)
            res.status(500).json({ error: err })
        })
});



//patch for PUT (update)
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        id,
        message: `product id ${id} updated `
    })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        id,
        message: `product id ${id} deleted `
    })
});

router.put('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        id,
        message: `product id ${id} updated `
    })
})

module.exports = router;