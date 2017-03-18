'use strict';
module.exports = function(sequelize, DataTypes) {
  var schedule = sequelize.define('schedule', {
    schedule_nm: DataTypes.STRING,
    co_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  schedule.sync();
  return schedule;
};