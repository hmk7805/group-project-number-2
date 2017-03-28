'use strict';
const path = require("path");
var stormpath = require( 'express-stormpath' );
const db = require('../models');
const util = require("../utilities.js");

const userList = [];

// Routes
// =============================================================
module.exports = function(app) {

  app.get("/", stormpath.authenticationRequired, function(req, res) {
    console.log( req.user );
    checkUser( req.user );
    res.cookie( "userEmail", req.user.email ).sendFile(path.join(__dirname, "../public/Dashboard/theme/admin_2/app_calendar.html")); //landing page
  });


};

function checkUser( user ) {
      util.runSQL("SELECT count(*) count FROM users WHERE email = ?", [user.email])
          .then(function (results) {
              let userCount = results[0].count;
              if ( userCount === 0 ) { 
                console.log( "Creating user.")
                db.users.create({
                    name: user.fullName,
                    type: 'E',
                    co_id: 1,
                    user_name: user.username,
                    email: user.email
                    })
                .then(function (response) {
                    console.log( "User added to database.")
                })
              } else { 
                console.log( "User exists.")
              }
          })
}