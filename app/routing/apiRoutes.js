'use strict';

const db = require('../models');
const util = require("../utilities.js");
const stormpath = require('express-stormpath');
const sched = require("../routing/sched.js" );

module.exports = function (app) {
    console.log("Loading API routes");
    //adding availability for employees
    app.post("/api/v1/schedule/:user_id", function (req, res) {
        console.log(req.body);
        db.schedule_dtl.create({
            type: req.body.availability,
            user_id: req.params.user_id,
            date: req.body.date,
            hour: req.body.hour
        })
        .then((response) => {
            res.status(200).json(response);
        })

    })

    // Add a new company entry 
    app.post("/api/v1/company", function (req, res) {
        console.log(req.body);
        db.company.create({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        })
            .then(function (response) {
                res.status(200).json(response);
            })
    });

    // Add a new user
    app.post("/api/v1/user", function (req, res) {
        console.log(req.body);
        db.users.create({
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
            .then(function (response) {
                res.status(200).json(response);
            })
    })

    // THIS IS WHERE ADD A SCHEDULE GOES.
    app.post("/api/v1/addsched", function(req,res) {
        //console.log( "post:addsched:", req.body );
        console.log( `New schedule inserting at schedule id: ${req.body.schedule.schedule_id}` );
        if ( parseInt(req.body.schedule.schedule_id) === 0 ) {
            
            sched.insertSched( req.body )
            .then( sched.insertSchedDtl )
            .then( function( output ) { 
                res.status(200).json( output );
            })
        } else {
            console.log( "Updating an existing schedule" );
            sched.removeSchedDtl( req.body )
            .then( sched.updateSched )
            .then( sched.insertSchedDtl )
            .then( function( output ) { 
                res.status(200).json( output );
            })    
        }

    });

    // Return a company entry by ID
    app.get("/api/v1/company/:id", function (req, res) {
        console.log(req.params.id);
        db.company.findOne({
            where: {
                id: req.params.id
            }
        }).then(function (data) {
            console.log(data.dataValues);
            res.status(200).json(data.dataValues)
        });
    });

    // return as user entry by ID
    app.get("/api/v1/user/:email", function (req, res) {
        console.log(req.params.email);
        db.users.findOne({
            where: {
                email: req.params.email
            }
        }).then(function (data) {
            console.log(data);
            res.status(200).json(data.dataValues);
        })
    })

    // return as user entry by ID
    app.get("/api/v1/useremail/:email", function (req, res) {
        util.runSQL("SELECT * FROM v_user WHERE email = ?;", [req.params.email])
            .then(function (results) {
                res.status(200).json(results);
            })
    })

    // Return all schedules for a compnay 
    app.get("/api/v1/schedules/:co_id", function (req, res) {
        util.runSQL("select s.*, (select min( date ) from schedule_dtls d where d.schedule_id = s.id) sched_date from schedules s WHERE co_id = ?;", [req.params.co_id])
            .then(function (results) {
                res.status(200).json(results);
            })
    })
    //paint calendar
    //working/not working  covered/not covered,  shift that needs coverage = yellow/red shift that is covered == green
    // Return a specific schedule by ID 
    app.get("/api/v1/schedule/:id", function (req, res) {
        util.runSQL("SELECT * FROM v_schedule_status WHERE schedule_id = ?", req.params.id)
            .then(function (results) {
                res.status(200).json(results);
            })
    })

    // List of all employees for a company
    app.get("/api/v1/emps/:co_id", function (req, res) {
        db.users.findAll({
            where: {
                co_id: req.params.co_id
            }
        })
            .then(function (results) {
                let list = [];
                results.forEach(r => {
                    list.push(r.dataValues);
                })
                res.status(200).json(list);
            })
    });

    app.get("/api/v1/getUserData", stormpath.authenticationRequired, function (req, res) {
        console.log(req.user);
        res.json(req.user);
    });

}