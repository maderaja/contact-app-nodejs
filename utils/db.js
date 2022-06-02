const sequelize = require('sequelize');

const db = new sequelize('contact_nodejs', 'root', '', {
  dialect: 'mysql',
});

db.sync({});

module.exports = db;
