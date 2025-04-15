const {db} = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');

exports.getAllproduct = (req, res) => {
    const sql = 'SELECT * FROM product'
    db.query(sql, (err, result) => {
        if (err) {
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke Datbase',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan semua produk',res)
            }
        }
    })
}

exports.getProductByid = (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM product WHERE id_produk =?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke Datbase',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data produk dengan ID '+id+' tidak ditemukan',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data produk '+id,res)
            }
        }
    })
}

// Controller for creating transaksi
exports.createTransaksi = (req, res) => {
    // Ambil metode pembayaran dan idkaryawan dari request body dan session
    const { metode } = req.body;
    const karyawan = req.session.user.name;  // Ambil idkaryawan dari session
  
    if (!karyawan) {
      return res.status(400).json({
        message: "User not logged in",
        success: false
      });
    }
  
    // SQL query untuk membuat transaksi
    const sql = 'INSERT INTO transaksi (tanggal, metodeBayar, namaKaryawan) VALUES (NOW(),?,?)';
    db.query(sql, [metode, karyawan], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to create transaksi',
          error: err
        });
      } else {
        return res.status(201).json({
          message: 'Berhasil membuat transaksi',
          result: result
        });
      }
    });
  };
  
  exports.riwayatTransaksi = (req, res) => {
    const period = req.query.period || 'all';
  
    let sql = "SELECT * FROM riwayat";
    let params = [];
  
    // Add date filtering based on the period
    if (period !== 'all') {
      const now = new Date();
      let startDate;
  
      switch(period) {
        case 'today':
          // Start of today
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          sql += " WHERE tanggal_transaksi >= ?";
          params.push(startDate);
          break;
  
        case 'week':
          // Start of current week (Sunday = 0)
          const dayOfWeek = now.getDay();
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
          sql += " WHERE tanggal_transaksi >= ?";
          params.push(startDate);
          break;
  
        case 'month':
          // Start of current month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          sql += " WHERE tanggal_transaksi >= ?";
          params.push(startDate);
          break;
  
        case 'year':
          // Start of current year
          startDate = new Date(now.getFullYear(), 0, 1);
          sql += " WHERE tanggal_transaksi >= ?";
          params.push(startDate);
          break;
      }
    }
  
    // Add sorting to get newest transactions first
    sql += " ORDER BY tanggal_transaksi DESC";
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error fetching transaction history:', err);
        return responsAPI(500, 'Failed to fetch: ' + err, `Kegagalan mengambil riwayat transaksi: ${err}`, res);
      } else {
        return responsAPI(200, result, 'Berhasil mengambil riwayat transaksi', res);
      }
    });
  }

  // Controller for creating listitem
  exports.createListitem = (req, res) => {
    const { idtransaksi, idproduk, jumlah } = req.body;
    const sql = 'INSERT INTO listitem (idTransaksi, idProduk, jumlah) VALUES (?,?,?)';
    db.query(sql, [idtransaksi, idproduk, jumlah], (err, result) => {
      if (err) {
        return responsAPI(500, 'Failed to create list item', `Kegagalan membuat list item ${err}`, res);
      } else {
        return responsAPI(201, result, 'Berhasil membuat list item', res);
      }
    });
  };

// Update payment method for a transaction
exports.updatePaymentMethod = (req, res) => {
    const transactionId = req.params.id;
    const { metodeBayar } = req.body;
    
    // Validate input
    if (!metodeBayar || !['Tunai', 'Non Tunai'].includes(metodeBayar)) {
        return responsAPI(400, 'Invalid payment method', 'Metode pembayaran harus Tunai atau Non Tunai', res);
    }

    const sql = 'UPDATE transaksi SET metodeBayar = ? WHERE idTRX = ?';
    db.query(sql, [metodeBayar, transactionId], (err, result) => {
        if (err) {
            console.error('Error updating payment method:', err);
            return responsAPI(500, 'Failed to update payment method', `Kegagalan mengubah metode pembayaran: ${err.message}`, res);
        }
        
        if (result.affectedRows === 0) {
            return responsAPI(404, 'Transaction not found', `Transaksi dengan ID ${transactionId} tidak ditemukan`, res);
        }
        
        return responsAPI(200, { transactionId, metodeBayar }, 'Berhasil mengubah metode pembayaran', res);
    });
};

// Get all transactions
exports.getAllTransactions = (req, res) => {
    const sql = "SELECT * FROM riwayat ORDER BY tanggal_transaksi DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return responsAPI(500, 'Failed to fetch transactions', `Error: ${err.message}`, res);
        }
        
        return responsAPI(200, result, 'Berhasil mendapatkan data transaksi', res);
    });
};
