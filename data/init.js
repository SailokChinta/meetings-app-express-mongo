const mongoose = require('mongoose');

mongoose.set( 'useFindAndModify', false );
mongoose.set( 'returnOriginal', false );

// create models
require( '../models/User' );
require( '../models/Team' );
require( '../models/Meeting' );

// drop existing meetings-app database
require( './deseed' );

mongoose.connect( 'mongodb://localhost/meetings-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.on( 'error', ( err ) => {
    console.error.bind( console, 'connection error:', err.message );
    process.exit( 0 );
});

connection.on('open', function() {
  console.log( 'connected to mongodb database' );
  
  // import seed data, i.e. initial set of documents into collections of meetings-app database
  require( './seed' );
});