const mongoose = require( 'mongoose' );

// @todo May be a good idea to define sub-document schema for hours:minutes
const meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    startTime: {
        hours: {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    },
    endTime: {
        hours: {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    },
    attendees: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                required: true
            },
            email: {
                type: String,
                required: true
            }
        }
    ]
});

mongoose.model( 'Meeting', meetingSchema );