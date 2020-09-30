const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../modals/user');

router.post('/signup', (req, res, next) => {

    const password = req.body.password;
    User.find({ email: req.body.email }).exec()
        .then(result => {
            if (result.length) {
                res.status(409).json({
                    message: "user already registered!!"
                })

            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                            message: "Somthing went wrong in hash"
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        })
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'user registerd succussfuly!'
                                })
                            })
                            .catch(error => {
                                res.status(500).json({
                                    message: 'Somthing wen wrong while saving...',
                                    error: error
                                })
                            })
                    }
                })

            }
        })
        .catch(error => {
            res.status(500).json({
                error,
                message: "Somthing wrong in finding"
            })
        });

});


/* Login */

router.post('/login', (req, res, next) => {
    //console.log("In login")
    User.find({ email: req.body.email }).exec()
        .then(user => {
            console.log('user', user)
            if (!user.length) {
                res.status(401).status({
                    message: "Auth faild"
                })
            }

            if (req.body.password) {
                const candidatePass = req.body.password;
                const hash = user[0].password;

                //console.log("req.body.password", candidatePass)
                //console.log("hash", hash);


                bcrypt.compare(candidatePass, hash, (err, isMatch) => {
                    if (err) {
                        res.status(401).status({
                            message: "Auth faild"
                        })
                    };
                    console.log("process.env.JWT_KEY", process.env.JWT_KEY)

                    if (isMatch) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, process.env.JWT_KEY, {
                            expiresIn: '1h'
                        })
                        return res.status(200).json({
                            message: "Auth pass",
                            token
                        })
                    } else {
                        return res.status(409).json({
                            message: "Auth faild"
                        })
                    }
                });

            } else {
                return res.status("404").json({ error: "Enter the password" })
            }

        })
        .catch(error => {
            res.status(500).json({
                error,
                message: "Somthing wrong in finding email"
            })
        })
})



router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            })
        })
        .catch(error => {
            res.status(500).json({
                error,
                message: "user could not deleted!!"
            })
        })
})


module.exports = router;