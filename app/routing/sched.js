'use strict';

const db = require('../models');
const util = require("../utilities.js");

module.exports = {

    insertSched: function( body ) {
        console.log( "insertSched: ", body );
        return new Promise( function( resolve, reject ) {
            db.schedule.create( {
                schedule_nm: body.schedule.schedule_nm,
                co_id: body.schedule.co_id,
                user_id: body.schedule.user_id
            })
            .then( function( results ) {
                body.schedule_results = results.dataValues ;
                resolve( body );
            })
            .catch( function( results ) {
                reject( results );
            })
        })
    },

    insertSchedDtl: function( body ) {
        console.log( "InsertSchedDtl.body :", body )
        return new Promise( function( resolve, reject ) {
            let inserts = [];
            for ( let i = 0; i<body.hours.length; i++ ) {
                let hour = body.hours[i];
                inserts.push( 
                    db.schedule_dtl.create({
                        "schedule_id": body.schedule_results.id,
                        "type": body.schedule.type,
                        "user_id": body.schedule.user_id,
                        "date": hour.date,
                        "hour": hour.hour
                    })
                )
            }
            Promise.all( inserts )
            .then( function( results ) {
                body.dtls = [];
                for ( let i = 0; i<results.length; i++ ) {
                    body.dtls.push( results[i].dataValues );
                }
                console.log( body );
                resolve( body );
            })
            .catch( function( err ) {
                reject( new Error( err ) );
            })
        })
    },

    removeSched: function( body ) {
        console.log( "removeSched: ", body )
        return new Promise( function( resolve, reject ) {
            db.schedule.distroy( {
                where: {
                    id: body.schedule.schedule_id
                }
            })
            .then( function( results ) {
                resolve( body );
            })
            .catch( function( err ) {
                reject( new Error( err ) );
            })
        })
    },

    removeSchedDtl: function( body ) {
        console.log( "removeSchedDtl", body );
        return new Promise( function( resolve, reject ) {
            db.schedule_dtl.destroy( {
                where: {
                    schedule_id: body.schedule.schedule_id
                }
            })
            .then( function( results ) {
                resolve( body );
            })
            .catch( function( err ) {
                reject( new Error( err ) );
            } );
        })
    },

    updateSched: function( body ) {
        console.log( "updateSched: ", body );
        return new Promise( function( resolve, reject ) {
            db.schedule.update( {
                "schedule_nm": body.schedule.schedule_nm
            },
            { 
                "where": { id: body.schedule.schedule_id }
            })
            .then( function( result ) {
                resolve( body );
            })
            .catch( function( err ) {
                reject( new Error( err ) );
            })
        })
    }

}