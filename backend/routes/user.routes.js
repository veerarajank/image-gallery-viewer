const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const router = express.Router()
const DIR = './public/'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// User model
const User = require('../models/User');

router.post('/upload-images', upload.array('imgCollection', 6), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        imgCollection: (url + '/public/' + req.files[0].filename)
    });
    user.save().then(result => {
        res.status(201).json({
            message: "Done upload!",
            userCreated: {
                _id: result._id,
                imgCollection: result.imgCollection
            }
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    })
})

// Archive model
const Archive = require('../models/Archive');

router.get('/archive', (req, res) => {
    User.findById(mongoose.Types.ObjectId(req.query.id)).then(result => {
            const archive = new Archive({
                _id: result._id,
                imgCollection: result.imgCollection
            });
            archive.save().then(saveResult => {
                User.findByIdAndDelete(mongoose.Types.ObjectId(result._id)).then(delResult => {
                    res.status(200).json({
                        message: "Done !",
                        userCreated: {
                            _id: delResult._id,
                            imgCollection: delResult.imgCollection
                        }
                    })
                }).catch(err => { 
                    res.status(500).json({ 
                        error:err 
                    }) 
                })
            }).catch(err => { 
                res.status(500).json({ 
                    error:err 
                }) 
            })
    }).catch(err => { 
        res.status(404).json({
             error:"Not found" 
        })
    })
})

router.get('/unarchive', (req, res) => {
    Archive.findById(mongoose.Types.ObjectId(req.query.id)).then(result => {
        const user = new User({
            _id: result._id,
            imgCollection: result.imgCollection
        });
        user.save().then(saveResult => {
            Archive.findByIdAndDelete(mongoose.Types.ObjectId(result._id)).then(delResult => {
                res.status(200).json({
                    message: "Done !",
                    userCreated: {
                        _id: delResult._id,
                        imgCollection: delResult.imgCollection
                    }
                })
            }).catch(err => {
                 res.status(500).json({ 
                     error:err 
                })
            })
        }).catch(err => { 
            res.status(500).json({ 
                error:err 
            }) 
        })
    }).catch(err => { 
        res.status(404).json({ 
            error:"Not found" 
        }) 
    })
})

router.get('/delete', (req, res) => {
    User.findByIdAndDelete(mongoose.Types.ObjectId(req.query.id)).then(result => {
        res.status(200).json({
            message: "Done !",
            userCreated: {
                _id: result._id,
                imgCollection: result.imgCollection
            }
        })
    }).catch(err => { 
        res.status(500).json({
             error:"Not found" 
        }) 
    })
})

router.get("/", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "User list retrieved successfully!",
            users: data
        });
    });
});

module.exports = router;