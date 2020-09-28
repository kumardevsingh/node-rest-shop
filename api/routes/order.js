const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'order fetched'
    })
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'order created',
        order
    })
});
router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status('200').json({
        id,
        message: `order  ${id} fetched!`

    })
});


router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status('200').json({
        id,
        message: `order  ${id} deleted!`

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