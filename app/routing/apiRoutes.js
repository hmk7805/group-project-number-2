'use strict';

const db = require('../models');
const util = require("../utilities.js");

module.exports = function (app) {
    console.log( "Loading API routes" );

    app.get( "/api/v1/company/:id", function( req, res ) {
        console.log( req.params.id );
        db.company.findOne( {
            where: {
                id: req.params.id
            }
        }).then( function( data ) {
            console.log( data.dataValues );
            res.status(200).json( data.dataValues )
        });
    });

    app.get( "/api/v1/user/:id", function( req, res ) {
        console.log( req.params.id );
        db.users.findOne( {
            where: {
                id: req.params.id
            }
        }).then( function( data ) {
            console.log( data.dataValues );
            res.status(200).json( data.dataValues );
        })
    })

    app.get( "/api/v1/schedules", function( req, res ) {
        util.runSQL( "SELECT * FROM schedules" )
        .then( function( results ) { 
            res.status(200).json( results );
        })
    })

}