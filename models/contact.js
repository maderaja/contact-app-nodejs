const Sequelize = require('sequelize');
const db = require('../utils/db');

const Contact = db.define(
  'contact2',
  {
    nama: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    nohp: { type: Sequelize.STRING },
    foto: { type: Sequelize.STRING },
    tanggal: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
    timestamps: false,

    // I don't want createdAt
    createdAt: false,

    // I don't want updatedAt
    updatedAt: false,
  }
);

module.exports = Contact;
