// Handles /api/calendar/...

const express = require('express');
const mongoose = require( 'mongoose' );

const router = express.Router();
const Meeting = mongoose.model( 'Meeting' );

/*
    *** Sample queries ***
    http://localhost:3000/api/calendar?date=2020-09-11&userId=123456789012345678901234
    http://localhost:3000/api/calendar?date=2020-09-09&email=jane.doe@example.com
*/
router.get( '/', function (req, res, next) {
    const date = new Date( req.query.date );
    const userId = req.query.userId;
    const email = req.query.email;

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