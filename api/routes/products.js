const e = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const dateString = "abcd";//new Date().toISOString();
        cb(null, dateString + "-" + file.originalname)

    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(true, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const Product = require('../modals/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select("_id name price productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {/* you can change the response here */
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage ? doc.productImage : '',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }

                })
            }
            if (docs.length >= 0) {
                res.status(200).json(response)
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

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path

    });
    product.save().then((result) => {
        res.status(201).json({
            message: ' Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
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
        .select("_id name price productImage")
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                })
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

            if (result.nModified) {
                res.status(200).json({
                    product: result,
                    message: `id no: ${id} updated successfully!`,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + id
                    }
                })
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