// Handles /api/calendar/...

const express = require('express');
const mongoose = require( 'mongoose' );

const router = express.Router();
const Meeting = mongoose.model( 'Meeting' );

const { authenticate } = require( '../utils/auth' );

/*
    *** Sample queries ***
    http://localhost:3000/api/calendar?date=2020-09-11
    http://localhost:3000/api/calendar?date=2020-09-09
*/
router.get( '/', authenticate );
router.get( '/', function (req, res, next) {
    const date = new Date( req.query.date );
    const userId = req.claims.userId;
    // const email = req.query.email;
    const email = req.claims.email;

    const filter = { date, attendees: { $elemMatch: { } } };

    if( userId ) {
        filter.attendees.$elemMatch.userId = userId;
    }
    
    if( email ) {
        filter.attendees.$elemMatch.email = email;
    }

    Meeting
        .find( filter )
        .exec(( error, results ) => {
            if( error ) {
                error.status = 500;
                return next( error );
            }

            res.json( results );
        });
});

module.exports = router;