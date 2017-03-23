'use strict';

var db = require( "./app/models" );

const express = require('express');
const port = process.env.port || 3000;
var bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory for html, styling, etc.
app.use(express.static("./app/public"));

const html = require('./app/routing/htmlRoutes.js')(app);
const api = require('./app/routing/apiRoutes.js')(app);
// loads the index.html for now
// html(app);

db.sequelize.sync(  ).then( function() {

    app.listen(port, () => {
        console.log(`Listening on port '${port}'`);
    });

});
