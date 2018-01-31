var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require ('express');
var jwt = rquire('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/film");
var debug = require('debug')('myapi:server');

router.post('/signup', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password


        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

router.post(‘signin’,function(req, res){
    User.findOne({
        email: req.body.email
    }, function(err,user){
        if_(err) {
            debug(err);
            throw err;
        }
        If(!user) {
            res.status(401).send({success:false, msg:’Authentication Failed. User Not Found’});
        }else
        {
//Check if password matches
            user.comparePassword((request(req.body.password, function(err,isMatch){
                if (isMatch && !err){
                    var token = jwt.sign(user.toJSON(), config.secret);
                    res.json({success:true, token:’JWT ’ + token})
                }
            });
        }
    });
});

getToken = function(headers) {
    if(headers && headers.authorization){
        var parted = head.author.authorization.split(‘ ‘);
        if(parted.length === 2) {
            debug(‘First part of authorization’ + parted[0]);
            debug(‘JWT Token part of authorization’ + parted[0]);
            return parted[1];
        }else {
            return null;
        }
    }
    else {
        return null;
    }
};

router.post('/signin', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

router.post('/film', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newFilm = new Film({

            title: req.body.title,
            director: req.body.title,
            studio: req.body.studio,
            year: req.body.year,
            review: req.body.review,
            reviewer:req.body.reviewer,
            img: req.body.img,
        });

        newFilm.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Save film failed.'});
            }
            res.json({success: true, msg: 'Successful created new film.'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.get('/film', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Film.find(function (err, films) {
            if (err) return next(err);
            res.json(films);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});



getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
module.exports = router;