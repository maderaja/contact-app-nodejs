const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const contactController = require('../controllers/contactController');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const Contact = require('../models/contact');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/foto/');
  },

  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      file.originalname
      // moment().format('HH-mm-ss') + file.originalname
    );
  },
});
const upload = multer({ storage: storage });

// Halaman Home
router.get('/', contactController.home);

// Halaman About
router.get('/about', contactController.about);

// Halaman Contact
router.get('/contact', contactController.getAllContact);

// Halaman form tambah data contact
router.get('/contact/add', contactController.contactForm);

// Proses tambah data contact
router.post(
  '/contact',
  upload.single('foto'),
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ where: { nama: value } });
      if (duplikat) {
        throw new Error('Nama contact sudah terdaftar!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
    check('nohp', 'Nomor HP Tidak Valid!').isMobilePhone('id-ID'),
  ],
  contactController.createContact
);

// Proses delete contact
router.delete('/contact', contactController.deteleContact);

// Halaman form ubah data contact
router.get('/contact/edit/:id', contactController.editForm);

// Proses ubah data
router.put(
  '/contact',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ where: { nama: value } });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama contact sudah terdaftar!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
    check('nohp', 'Nomor HP Tidak Valid!').isMobilePhone('id-ID'),
  ],
  contactController.editContact
);

// Halaman detail contact
router.get('/contact/:id', contactController.detailContact);

module.exports = router;
