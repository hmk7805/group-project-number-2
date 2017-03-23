const mysql = require( "mysql" );
const config = require("./config/config.json" );
const localCfg = config.development;

var connection = mysql.createConnection({
  host     : localCfg.host,
  user     : localCfg.username,
  password : localCfg.password,
  database : localCfg.database
})

connection.connect( function() {
    console.log( "Connected to mysql" );
});

function runSQL( SQLText, params ) {
    return new Promise( function( resolve, reject ) {
        connection.query( SQLText, params, function( err, results, fields ) {
            if ( err ) reject( err );
            resolve( results );
        })
    })
}

module.exports = {
    "runSQL": runSQL
}