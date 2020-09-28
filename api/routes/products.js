const e = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../modals/product');

router.get('/', (req, res, next) => {
    Product.find().
        exec()
        .then(docs => {
            if (docs.length >= 0) {
                console.log(docs);
                res.status(200).json(docs)
            } else {
                res.status(404).json({
                    message: "No data found"
                })
            }

        })
        .catch(error => {
            console.error(error)
            res.status(500).json({ error })
        })
    /* res.status(200).json({
        message: 'from products get function'
    }) */
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

    }).catch(error => {
        console.error(error)
        res.status(500).json({ error })
    })



})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log(id)
    Product.findById(id)

        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    message: "Id not found"
                })
            }


        })
        .catch(error => {
            console.error(error)
            res.status(500).json({ error })
        })
});




router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (let ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            console.log("in patch function:- ", result);
            if (result.nModified) {
                res.status(200).json({ message: `id no: ${id} updated successfully!`, result })
            } else {
                res.status(404).json({ message: `id no: ${id} could not updated` })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then(doc => {
        if (doc) {
            res.status(200).json({ message: `id no: ${id} removed successfully!`, result: doc })
        } else {
            res.status(404).json({ message: `id no: ${id} not deleted` })
        }
    }
    ).catch(error => {
        res.status(500).json({ error })
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