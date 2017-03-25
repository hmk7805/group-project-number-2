const path = require("path");
var stormpath = require( 'express-stormpath' );
// Routes
// =============================================================
module.exports = function(app) {

  app.get("/", stormpath.loginRequired, function(req, res) {
    console.log( req.user );
    res.sendFile(path.join(__dirname, "../public/Dashboard/theme/admin_2/app_calendar.html")); //landing page
  });


};