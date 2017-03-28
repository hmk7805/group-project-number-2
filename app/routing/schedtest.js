const sched = require( "../routing/sched.js" );

let fresh =     {
        "schedule": {
            "schedule_id": 0,
            "schedule_nm": "NewSchedule",
            "co_id": 1,
            "user_id": 1,
            "type": "R"
        },
        "hours": [
            { "date": "2017-03-29", "hour": 13 },
            { "date": "2017-03-29", "hour": 14 },
            { "date": "2017-03-29", "hour": 15 },
            { "date": "2017-03-29", "hour": 16 },
            { "date": "2017-03-29", "hour": 17 },
            { "date": "2017-03-29", "hour": 18 },
            { "date": "2017-03-29", "hour": 19 }
        ]
    };
let existing =     {
        "schedule": {
            "schedule_id": 44,
            "schedule_nm": "UpdatedSchedule",
            "co_id": 1,
            "user_id": 1,
            "type": "R"
        },
        "hours": [
            { "date": "2017-03-29", "hour": 13 },
            { "date": "2017-03-29", "hour": 14 },
            { "date": "2017-03-29", "hour": 15 },
        ]
    };

body = existing;

console.log( "BODY: " , body );

if ( body.schedule.schedule_id === 0 ) {
    console.log( "New schedule inserting" );
    sched.insertSched( body )
    .then( sched.insertSchedDtl )
    .then( function( output ) { 
        console.log( output ) 
    })
} else {
    console.log( "Updating an existing schedule" );
    sched.removeSchedDtl( body )
    .then( sched.updateSched )
    .then( sched.insertSchedDtl )
    .then( function( output ) { 
        console.log( output ) 
    })    
}


