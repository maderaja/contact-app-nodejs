const moment = require('moment');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Contact = require('../models/contact');

// Route
const home = (req, res) => {
  const mahasiswa = [
    {
      nama: 'Raja Mahendra',
      email: 'raja@gmail.com',
    },
    {
      nama: 'Toni Galih',
      email: 'toni@gmail.com',
    },
    {
      nama: 'Erik Mahardika',
      email: 'erik@gmail.com',
    },
  ];
  res.render('index', {
    title: 'Home',
    layout: 'layouts/main-layout',
    nama: 'Raja Mahendra',
    mahasiswa: mahasiswa,
  });
};

const about = (req, res) => {
  res.render('about', {
    title: 'About',
    layout: 'layouts/main-layout',
  });
};

const getAllContact = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.render('contact', {
      title: 'Contact',
      layout: 'layouts/main-layout',
      contacts: contacts,
      msg: req.flash('msg'),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const contactForm = (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Contact',
    layout: 'layouts/main-layout',
  });
};

const createContact = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      title: 'Form Tambah Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    try {
      const { nama, email, nohp } = req.body;
      const foto = req.file.originalname;
      // const foto = moment().format('HH-mm-ss') + req.file.originalname;
      const jam = moment().format('HH:mm:ss');
      const tanggal = moment().format('DD-MM-YYYY');
      const waktu = `${tanggal} ${jam}`;
      const newContact = new Contact({
        nama: nama,
        email: email,
        nohp: nohp,
        foto: foto,
        tanggal: waktu,
      });
      newContact.save();
      req.flash('msg', 'Data Contact Berhasil Di Tambah!');
      res.redirect('/contact');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

const deteleContact = async (req, res) => {
  try {
    const id = req.body.id;
    const contact = await Contact.findOne({ where: { id: id } });

    const foto = contact.foto;
    fs.unlinkSync(`./public/foto/${foto}`);

    const deleteContact = await Contact.destroy({
      where: { id: id },
    });

    await deleteContact;
    req.flash('msg', 'Data Contact Berhasil Di Hapus!');
    res.redirect('/contact');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const editForm = async (req, res) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findOne({ where: { id: id } });

    res.render('edit-contact', {
      title: 'Form Ubah Contact',
      layout: 'layouts/main-layout',
      contact: contact,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const editContact = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('edit-contact', {
      title: 'Form Edit Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    try {
      const { nama, email, nohp } = req.body;
      const id = req.body.id;
      const updateContact = Contact.update(
        {
          nama,
          email,
          nohp,
        },
        {
          where: { id: id },
        }
      );

      updateContact;
      req.flash('msg', 'Data Contact Berhasil Di Ubah!');
      res.redirect('/contact');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
};

const detailContact = async (req, res) => {
  try {
    const id = req.params.id;
    const getContact = await Contact.findOne({
      where: { id: id },
    });
    let waktu = 'Waktu tidak diketahui';
    if (getContact) {
      const tanggal = getContact.tanggal;
      waktu = moment(tanggal, 'DD-MM-YYYY, HH:mm:ss').fromNow();
    }
    res.render('detail', {
      title: 'Detail Contact',
      layout: 'layouts/main-layout',
      contact: getContact,
      waktu: waktu,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  home,
  about,
  getAllContact,
  contactForm,
  createContact,
  deteleContact,
  editForm,
  editContact,
  detailContact,
};
