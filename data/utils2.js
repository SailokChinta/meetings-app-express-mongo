const mongoose = require( 'mongoose' );

const User = require( '../models/User' );
const Team = require( '../models/Team' );
const Meeting = require( '../models/Meeting' );

const users = require( './users.json' );
const teams = require( './teams.json' );
const meetings = require( './meetings.json' );

// shallow typecast helper for fields in Extended JSON format
function transform( documents ) {
    return documents.map( document => {
        const transformedDocument = {};

        for( key in document ) {
            if( document.hasOwnProperty( key ) ) {
                if( typeof document[key] === 'object' && document[key] !== null ) {
                    if( '$oid' in document[key] ) {
                        transformedDocument[key] = mongoose.Types.ObjectId( document[key].$oid );
                    } else if( '$date' in document[key] ) {
                        transformedDocument[key] = new Date( document[key].$date );
                    } else {
                        transformedDocument[key] = document[key];
                    }
                } else {
                    transformedDocument[key] = document[key];
                }
            }
        }

        return transformedDocument;
    });
}

module.exports = {
    clean() {
        User.delete( {} );
        Team.delete( {} );
        Meeting.delete( {} );
    },
    load() {
        console.log( transform( users ) );
        console.log( transform( teams ) );
        console.log( transform( meetings ) );
        
        // User.insertMany( typeCastFields( users ) );
        // Team.insertMany( typeCastFields( teams ) );
        // Meeting.insertMany( typeCastFields( meetings ) );
    }
};