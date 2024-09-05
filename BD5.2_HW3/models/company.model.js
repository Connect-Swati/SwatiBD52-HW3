/*
'name': 'Tech Innovators',
    'industry': 'Technology',
    'foundedYear': 2010,
    'headquarters': 'San Francisco',
    'revenue': 75000000
    */
const { sequelize_instance, DataTypes } = require("../lib/index");
const companies = sequelize_instance.define("companies", {
  name: DataTypes.TEXT,
  industry: DataTypes.TEXT,
  foundedYear: DataTypes.INTEGER,
  headquarters: DataTypes.TEXT,
  revenue: DataTypes.INTEGER,
});
module.exports = companies;
