"use strict";

module.exports = function(sequelize, DataTypes) {
  var vin = sequelize.define("vin", {
    vin: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        vin.hasMany(models.obdii_data)
      }
    }
  });

  return vin;
};
