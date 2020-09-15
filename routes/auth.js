const express = require( 'express' );
const router = express.Router();
const jwt = require( 'jsonwebtoken' );

const mongoose = require( 'mongoose' );
const User = mongoose.model( 'User' );

/**
 * Sample request body
 * req.body = { "email": "john.doe@example.com", "password": "johndoe" }
 */
router.post('/login', (req, res, next) => {
    const credentials = req.body;

    User
        .findOne( credentials )
        .exec(( error, result ) => {
            if( error || Object.keys( result ).length === 0 ) {
                error.status = 403;
                return next( error );
            }

            const claims = { email: result.email };
        
            jwt.sign(claims, 'shh...', {expiresIn: '24h'}, function( error, token ) {
                console.log( 'jwt token generated' );

                if( error ) {
                    return res.status(401).json({ message: error.message });
                }

                res.status(200).json({
                    message: 'Signed in sucessfully',
                    token: token,
                    email: result.email,
                    name: result.name
                });
            });
        });  
});

module.exports = router;