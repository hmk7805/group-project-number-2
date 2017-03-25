'use strict';

var db = require( "./app/models" );

const express = require('express');
const port = process.env.port || 3000;
var bodyParser = require("body-parser");
var stormpath = require( 'express-stormpath' );

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(stormpath.init( app, {
	application: {
		href: 'https://api.stormpath.com/v1/applications/1M6Oils9Itmj7d239Wq368'
	},
	website: true,
	expand: {
	customData: true
}
}));



// Static directory for html, styling, etc.
app.use(express.static("./app/public"));


const html = require('./app/routing/htmlRoutes.js')(app);
const api = require('./app/routing/apiRoutes.js')(app);
// loads the index.html for now
// html(app);

app.on( 'stormpath.ready', function() {
	db.sequelize.sync(  ).then( function() {
	
	    app.listen(port, () => {
	        console.log(`Listening on port '${port}'`);
	    });
	
	});
});
