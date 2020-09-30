const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../modals/order');
const Product = require('../modals/product');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
    Order
        .find()
        .select('_id product quantity')
        .populate('product', 'name')
        .then(result => {
            console.log(" result length:--", result.length)
            const response = {
                count: result.length,
                orders: result.map(item => {
                    return {
                        _id: item._id,
                        product: item.product,
                        quantity: item.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + item._id
                        }
                    }

                })
            }

            console.log(response)

            res.status(200).json(response);
        }
        ).catch(error => {
            res.status(500).json(error)
        })
});


router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found!!"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId

            })

            //save the order
            return order.save();

        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created successfuly',
                order: result
            })
        })
        .catch(error => {
            res.status(500).json({ message: "Could not created order!!", error })
        })

});
router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
        .populate('product', 'name')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: "Order not found!!" })
            }
            res.status(200).json(result)
        }).catch(error => {
            res.status(500).json({ message: "Could not created order!!", error })
        })
});


router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({ message: "Order deleted successfuly", result })
        }).catch(error => {
            res.status(500).json({ message: "Could not delete order!!", error })
        })

});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        id,
        message: `order id ${id} updated `
    })
});


module.exports = router;