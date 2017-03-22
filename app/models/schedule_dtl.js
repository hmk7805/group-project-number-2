'use strict';
module.exports = function(sequelize, DataTypes) {
  var schedule_dtl = sequelize.define('schedule_dtl', {
    schedule_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    hour: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  // schedule_dtl.sync();
  return schedule_dtl;
};