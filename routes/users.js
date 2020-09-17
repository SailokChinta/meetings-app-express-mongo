// Handles /api/users/...

const express = require('express');
const mongoose = require( 'mongoose' );

const router = express.Router();
const User = mongoose.model( 'User' );

const { authenticate } = require( '../utils/auth' );

/*
    *** Sample queries ***
    http://localhost:3000/api/users
*/
router.get( '/', authenticate );
router.get('/', function (req, res, next) {
    User
        .find()
        .select( '-password' )
        .sort( 'email' )
        .exec(( error, results ) => {
            if( error ) {
                error.status = 500;
                return next( error );
            }

            res.json( results );
        });

});

module.exports = router;