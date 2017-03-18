
var db = require( "./models" );

db.company.create( {
    name: "Don Knapp",
    address: "2527 Shelburne Pl.,",
    city: "Mint Hill",
    state: "NC",
    zip: "25227",
    url: ""
});

db.users.create( { name: "Don Knapp",
  type: "E",
  co_id: 1,
  user_name: "dknapp",
  password: "penny",
  address: "2527 Shelburne Pl.",
  email: "don@dknapp.com",
  phone: "555-1212",
  img: "https://avatars1.githubusercontent.com/u/6484531?v=3&s=460"
 });

 db.schedule.create( {
     schedule_name: "MyCo. Weekday",
     co_id: 1,
     user_id: 1
 });

db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 13 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 14 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 15 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 16 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 17 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 18 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 19 });
db.schedule_dtl.create( { schedule_id: 1, type: 'R', date: "2017-03-20", hour: 20 });