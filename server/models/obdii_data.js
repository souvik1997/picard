"use strict";

module.exports = function(sequelize, DataTypes) {
  var obdii_data = sequelize.define("Task", {
    speed: DataTypes.DECIMAL,
	rpm: DataTypes.DECIMAL,
	throttle_position: DataTypes.DECIMAL,
  }, {
    classMethods: {
      associate: function(models) {
        obdii_data.belongsTo(models.vin);
      }
    }
  });

  return obdii_data;
};
