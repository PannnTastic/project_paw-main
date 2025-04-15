const express = require('express');
const bodyParser = require('body-parser');
const karyawanController = require('../controller/karyawancontroller');
const auth = require('../middleware/auth');

const karyawan = express.Router();
karyawan.use(bodyParser.json());

// Apply middleware to ensure only cashiers can access these routes
karyawan.use(auth.validateKasir);

// frontend
karyawan.get('/dashboard', (req, res) => {
    const user = req.session.user;
    res.render('karyawan/dashboardKaryawan', {user})
})
karyawan.get('/riwayat', (req, res) => {
    const user = req.session.user;
    res.render('karyawan/riwayat', {user})
})

// Route to render transactions management page
karyawan.get('/transactions-page', (req, res) => {
    const user = req.session.user;
    res.render('karyawan/transactions', { user });
});

//produk
karyawan.get('/product',karyawanController.getAllproduct);
karyawan.get('/product:id',karyawanController.getProductByid)

//transaksi
karyawan.get('/transaksi',karyawanController.riwayatTransaksi)
karyawan.post('/transaksi',karyawanController.createTransaksi)
karyawan.put('/transaksi/:id/payment-method', karyawanController.updatePaymentMethod);
karyawan.post('/listitem',karyawanController.createListitem)
karyawan.get('/transactions', karyawanController.getAllTransactions);

module.exports = karyawan;