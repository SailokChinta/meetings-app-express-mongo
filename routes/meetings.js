// Handles /api/meetings/...

const express = require('express');
const mongoose = require( 'mongoose' );

const router = express.Router();
const User = mongoose.model( 'User' );
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

/*
    Adding a new user as attendee for a meeting
    
    *** Sample queries ***
    http://localhost:3000/api/meetings/345678901234567890123413?action=add_attendee&userId=123456789012345678901236&email=mark.smith@example.com
*/
router.patch( '/:id', function(req, res, next) {
    const action = req.query.action
    const userId = req.query.userId;
    const email = req.query.email;
    
    const meetingId = req.params.id;
    
    const filter = {};

    if( userId ) {
        filter._id = userId;
    }
    
    if( email ) {
        filter.email = email;
    }

    User
        .findOne( filter )
        .exec(( error, result ) => {
            if( error ) {
                error.status = 500;
                return next( error );
            }

            if( !result ) {
                const error = new Error( `user with matching user id = ${userId} and email id = ${email} not found` );
                return next( error );
            }

            const updateDoc = { attendees: { } };

            switch( action ) {
                case 'add_attendee':
                    updateDoc.attendees.$addToSet = [
                        { userId: result._id, email: result.email }
                    ];
                    break;
                case 'remove_attendee':
                    updateDoc.attendees.$pull = [
                        { userId: result._id, email: result.email }
                    ];
                    break;
            }

            Meeting
                .update( updateDoc )
                .exec(( error, results ) => {
                    if( error ) {
                        error.status = 500;
                        return next( error );
                    }

                    res.json( results );
                });
        });
});

module.exports = router;