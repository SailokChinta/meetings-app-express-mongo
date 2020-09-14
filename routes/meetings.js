// Handles /api/meetings/...

const express = require('express');
const mongoose = require( 'mongoose' );

const router = express.Router();
const Meeting = mongoose.model( 'Meeting' );

/*
    *** Sample queries ***
    http://localhost:3000/api/meetings?period=all&userId=123456789012345678901234&email=john.doe@example.com
    http://localhost:3000/api/meetings?period=all&userId=123456789012345678901234
    http://localhost:3000/api/meetings?period=past&email=john.doe@example.com
*/
router.get( '/', function (req, res, next) {
    const period = req.query.period.toLowerCase();
    const search = req.query.search;
    const userId = req.query.userId;
    const email = req.query.email;

    const filter = { date: { }, attendees: { $elemMatch: { } } };

    if( userId ) {
        filter.attendees.$elemMatch.userId = userId;
    }
    
    if( email ) {
        filter.attendees.$elemMatch.email = email;
    }

    const today = new Date();

    switch( period ) {
        case "past":
            filter.date.$lt = today;
            break;
        case "present":
            filter.date.$eq = today;
            break;
        case "future":
            filter.date.$gt = today;
            break;
        default: // "all" or anything else
            delete filter.date;
    }

    if( search ) {
        filter.description = {
            $regex: new RegExp( search, "i" )
        }
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