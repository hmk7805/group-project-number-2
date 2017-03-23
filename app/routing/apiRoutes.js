'use strict';

const db = require('../models');
const util = require("../utilities.js");

module.exports = function (app) {
    console.log( "Loading API routes" );

    // Add a new company entry 
    app.post( "/api/v1/company", function( req, res ) {
        console.log( req.body );
        db.company.create( {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        })
        .then( function( response ) {
            res.status(200).json( response );
        })
    });

    // Add a new user
    app.post( "/api/v1/user", function( req, res ) {
        console.log( req.body );
        db.users.create( {
            name: req.body.name,
            type: req.body.type,
            co_id: req.body.co_id,
            user_name: req.body.user_name,
            password: req.body.password,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            email: req.body.email,
            phone: req.body.phone,
            img: req.body.img
        })
        .then( function( response ) {
            res.status(200).json( response );
        })
    })

    // THIS IS WHERE ADD A SCHEDULE GOES. . . TO be comtinued.

    // Return a company entry by ID
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

    // return as user entry by ID
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

    // Return all schedules for a compnay 
    app.get( "/api/v1/schedules/:co_id", function( req, res ) {
        util.runSQL( "SELECT * FROM schedules WHERE co_id = ?", [req.params.co_id] )
        .then( function( results ) { 
            res.status(200).json( results );
        })
    })

    // Return a specific schedule by ID 
    app.get( "/api/v1/schedule/:id", function( req, res ) {
        util.runSQL( "SELECT * FROM v_schedule_status WHERE schedule_id = ?", req.params.id )
        .then( function( results ) {
            res.status(200).json( results );
        })
    })

    // List of all employees for a company
    app.get( "/api/v1/emps/:co_id", function( req,res ) {
        db.users.findAll( {
            where: {
                co_id: req.params.co_id
            }
        })
        .then( function( results ) {
            let list = [];
            results.forEach( r => {
                list.push( r.dataValues );
            })
            res.status(200).json( list );
        })
    })
}