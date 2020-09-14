const { execSync } = require( 'child_process' );

// drop the database and add seed data
// Reference: https://stackoverflow.com/questions/8857276/how-do-i-drop-a-mongodb-database-from-the-command-line
try {
    execSync( 'mongoimport --db meetings-app --collection users --drop --file ./data/users.json --jsonArray' );
    console.log( 'imported documents into meetings-app.users' );

    execSync( 'mongoimport --db meetings-app --collection teams --drop --file ./data/teams.json --jsonArray' );
    console.log( 'imported documents into meetings-app.teams' );

    execSync( 'mongoimport --db meetings-app --collection meetings --drop --file ./data/meetings.json --jsonArray' );
    console.log( 'imported documents into meetings-app.meetings' );
} catch( err ) {
    console.log( 'some problems encountered when trying to imports documents in collections of meetings-app' );
    console.error( err );
}