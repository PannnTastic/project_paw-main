const {db} = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');

exports.getAllproduct = (req,res) =>{
    const sql = 'SELECT * FROM product' 
    db.query(sql, (err, result) => {
        if(err){
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke database' + err,res)
        }else{
            if(result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else{
                return responsAPI(200,result,'Berhasil mendapatkan semua data product',res)
            }
        }
    })
}

exports.getProductBynama = (req,res) => {
    const nama = req.body.nama
    const sql = 'SELECT * FROM user WHERE namaProduk =?'
    db.query(sql, [nama], (err, result) => {
        if (err) {
            return responsAPI(500,'Failed to get user','Kegagalan mendapatkan data user',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data user dengan ID '+ nama +' tidak ditemukan',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data user',res)
            }
        }
    })
}

exports.createProduct = (req,res) =>{
    const { namaProduk,kategori,harga } = req.body
    if (!req.file) {
        const err = new Error('Please upload a file')
        throw err;
    }
    const image = req.file.filename
    console.log(image)
    const img = 'INSERT INTO foto(link) values(?)'

    db.query(img, [image], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to create product','Kegagalan membuat product',res)
        }else{
            db.query('SELECT idFoto FROM foto WHERE link = ?', [image], (err, result) => {  
                if(err){
                    return responsAPI(500,'Failed to create product','Kegagalan membuat product',res)
                }else{
                    const idFoto = result[0].idFoto
                    const sql = 'INSERT INTO produk(namaProduk, kategori, harga, linkFoto) VALUES (?,?,?,?)'
                    db.query(sql, [namaProduk, kategori, harga, idFoto], (err, result) => {
                        if(err){
                            return responsAPI(500,'Failed to create product','Kegagalan membuat product',res)
                        }else{
                            return responsAPI(201,result,'Berhasil membuat product',res)
                        }
                    })
                }
            })    
        }
    })

}

exports.updateProduct = (req,res) => {
    const id = req.params.id
    const { namaProduk, kategori, harga } = req.body
    const sql = 'UPDATE produk SET namaProduk =?, kategori =?, harga =? WHERE idProduk =?'
    db.query(sql, [namaProduk, kategori, harga, id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to update product','Kegagalan mengubah product',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data product dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil mengubah product',res)
            }
        }
    })
}

exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    // First get the linkFoto to delete the image later
    const getPhotoIdSql = 'SELECT linkFoto FROM produk WHERE idProduk = ?';
    
    db.query(getPhotoIdSql, [id], (err, photoResult) => {
        if (err) {
            console.error('Error getting photo ID:', err);
            return responsAPI(500, 'Failed to delete product', 'Kegagalan menghapus product: ' + err.message, res);
        }
        
        if (photoResult.length === 0) {
            return responsAPI(404, 'No data found', 'Data product dengan ID ' + id + ' tidak ditemukan', res);
        }
        
        const photoId = photoResult[0].linkFoto;
        
        // Delete the product first
        const deleteProductSql = 'DELETE FROM produk WHERE idProduk = ?';
        
        db.query(deleteProductSql, [id], (err, productResult) => {
            if (err) {
                console.error('Error deleting product:', err);
                // Check for foreign key constraint violation
                if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                    return responsAPI(400, 'Cannot delete product', 'Produk tidak dapat dihapus karena sedang digunakan dalam transaksi', res);
                }
                return responsAPI(500, 'Failed to delete product', 'Kegagalan menghapus product: ' + err.message, res);
            }
            
            if (productResult.affectedRows === 0) {
                return responsAPI(404, 'No data found', 'Data product dengan ID ' + id + ' tidak ditemukan', res);
            }
            
            // If product was deleted successfully and we have a photo ID, delete the photo
            if (photoId) {
                const deletePhotoSql = 'DELETE FROM foto WHERE idFoto = ?';
                
                db.query(deletePhotoSql, [photoId], (err, photoResult) => {
                    if (err) {
                        console.error('Error deleting photo:', err);
                        // We've already deleted the product, so just log this error
                        console.log('Product deleted but failed to delete photo with ID:', photoId);
                    }
                    
                    return responsAPI(200, { productResult, photoDeleted: !err }, 'Berhasil menghapus product', res);
                });
            } else {
                // No photo to delete
                return responsAPI(200, productResult, 'Berhasil menghapus product', res);
            }
        });
    });
};

exports.getAllkaryawan = (req,res) => {
    const sql = 'SELECT * FROM karyawan'
    db.query(sql, (err, result) => {
        if(err){
            return responsAPI(500,'No data found','Kegagalan menyambungkan ke database' + err,res)
        }else{
            if(result.length==0){
                return responsAPI(404,'No data found','Data kosong',res)
            }else{
                return responsAPI(200,result,'Berhasil mendapatkan semua data karyawan',res)
            }
        }
    })
}

exports.getKaryawanBynama = (req,res) => {
    const nama = req.body.id
    const sql = 'SELECT * FROM karyawan WHERE idKaryawan =?'
    db.query(sql, [nama], (err, result) => {
        if (err) {
            return responsAPI(500,'Failed to get karyawan','Kegagalan mendapatkan data karyawan',res)
        }else {
            if (result.length==0){
                return responsAPI(404,'No data found','Data karyawan dengan ID '+ nama +' tidak ditemukan',res)
            }else {
                return responsAPI(200,result,'Berhasil mendapatkan data karyawan',res)
            }
        }
    })
}

exports.createKaryawan = (req,res) =>{
    const { namaKaryawan, username, password } = req.body
    const sql = 'INSERT INTO karyawan (username, password, namaKaryawan) VALUES (?,?,?)'
    db.query(sql, [username, password,namaKaryawan ], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to create karyawan','Kegagalan membuat karyawan',res)
        }else{
         res.redirect('/admin/user')
        }
    })
}

exports.updateKaryawan = (req,res) => {
    const id = req.params.id
    const { namaKaryawan, username, password } = req.body
    const sql = 'UPDATE karyawan SET username =?, password =?, namaKaryawan =? WHERE idKaryawan =?'
    db.query(sql, [username, password, namaKaryawan, id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to update karyawan','Kegagalan mengubah karyawan',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data karyawan dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil mengubah karyawan',res)
            }
        }
    })
}

exports.deleteKaryawan = (req,res) => {
    const id = req.params.id
    const sql = 'DELETE FROM karyawan WHERE idKaryawan = ?'
    db.query(sql, [id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to delete karyawan','Kegagalan menghapus karyawan',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data karyawan dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil menghapus karyawan',res)
            }
        }
    })
}

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
      return responsAPI(500, 'Failed to fetch :' + err, `Kegagalan mengambil riwayat ${err}`, res);
    } else {
      return responsAPI(200, result, 'Berhasil mengambil riwayat', res);
    }
  });
}

exports.deleteTransaksi = (req,res) => {
    const id = req.params.id
    const sql = 'DELETE FROM transaksi WHERE idTRX =?'
    db.query(sql, [id], (err, result) => {
        if(err){
            return responsAPI(500,'Failed to delete transaksi','Kegagalan menghapus transaksi',res)
        }else{
            if(result.affectedRows==0){
                return responsAPI(404,'No data found','Data transaksi dengan ID '+ id +' tidak ditemukan',res)
            }else{
                return responsAPI(200,result,'Berhasil menghapus transaksi',res)
            }
        }
    })
}

exports.getFinancialData = (req, res) => {
  const startDate = req.query.startDate || new Date().toISOString().split('T')[0]; // Default to today
  const endDate = req.query.endDate || new Date().toISOString().split('T')[0]; // Default to today

  console.log(`Fetching financial data from ${startDate} to ${endDate}`);

  // Check if pengeluaran table exists
  db.query("SHOW TABLES LIKE 'pengeluaran'", (err, result) => {
    if (err) {
      console.error('Error checking for pengeluaran table:', err);
      return responsAPI(500, 'Database error', `Error checking tables: ${err}`, res);
    }

    const tableExists = result.length > 0;
    
    if (!tableExists) {
      console.log('Pengeluaran table does not exist. Creating it...');
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS pengeluaran (
          id int NOT NULL AUTO_INCREMENT,
          tanggal date NOT NULL,
          keterangan varchar(255) NOT NULL,
          jumlah decimal(10,2) NOT NULL,
          kategori varchar(50) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `;
      
      db.query(createTableQuery, (createErr) => {
        if (createErr) {
          console.error('Error creating pengeluaran table:', createErr);
          return responsAPI(500, 'Database error', `Error creating table: ${createErr}`, res);
        }
        
        console.log('Pengeluaran table created successfully');
        // Continue with data fetching with empty expenses
        processFinancialData(startDate, endDate, [], res);
      });
    } else {
      // Table exists, proceed with queries
      runQueries(startDate, endDate, res);
    }
  });
};

function runQueries(startDate, endDate, res) {
  // SQL to get total income from transactions
  const incomeQuery = `
    SELECT COALESCE(SUM(total), 0) as totalIncome
    FROM riwayat
    WHERE tanggal_transaksi BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)`;
  
  // Execute income query
  db.query(incomeQuery, [startDate, endDate], (err, incomeResult) => {
    if (err) {
      console.error('Error fetching income data:', err);
      return responsAPI(500, 'Failed to fetch income data', `Error: ${err}`, res);
    }

    // SQL to get expenses
    const expenseQuery = `
      SELECT id, tanggal, keterangan, jumlah, kategori
      FROM pengeluaran
      WHERE tanggal BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
      ORDER BY tanggal DESC`;

    // Execute expense query
    db.query(expenseQuery, [startDate, endDate], (err, expenses) => {
      if (err) {
        console.error('Error fetching expense data:', err);
        return responsAPI(500, 'Failed to fetch expense data', `Error: ${err}`, res);
      }
      
      // Process the financial data with obtained expenses
      processFinancialData(startDate, endDate, expenses, res, incomeResult);
    });
  });
}

function processFinancialData(startDate, endDate, expenses, res, incomeResult = null) {
  try {
    // If incomeResult wasn't passed, fetch it
    if (!incomeResult) {
      const incomeQuery = `
        SELECT COALESCE(SUM(total), 0) as totalIncome
        FROM riwayat
        WHERE tanggal_transaksi BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)`;
      
      db.query(incomeQuery, [startDate, endDate], (err, fetchedIncomeResult) => {
        if (err) {
          console.error('Error fetching income data:', err);
          return responsAPI(500, 'Failed to fetch income data', `Error: ${err}`, res);
        }
        
        continueProcessing(fetchedIncomeResult);
      });
    } else {
      continueProcessing(incomeResult);
    }
    
    function continueProcessing(incomeData) {
      // SQL to get total expenses
      const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.jumlah || 0), 0);
      
      // SQL to get chart data (daily for the specified period)
      const chartDataQuery = `
        SELECT 
          DATE(tanggal_transaksi) as date, 
          SUM(total) as dailyIncome
        FROM 
          riwayat
        WHERE 
          tanggal_transaksi BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY 
          DATE(tanggal_transaksi)
        ORDER BY 
          date`;
      
      // Execute chart data queries
      db.query(chartDataQuery, [startDate, endDate], (err, incomeChartData) => {
        if (err) {
          console.error('Error fetching chart data:', err);
          return responsAPI(500, 'Failed to fetch chart data', `Error: ${err}`, res);
        }

        try {
          // Process the data
          const totalIncome = incomeData[0].totalIncome || 0;
          const profit = totalIncome - totalExpense;

          // Group expenses by date for the chart
          const expensesByDate = {};
          expenses.forEach(expense => {
            const dateString = new Date(expense.tanggal).toISOString().split('T')[0];
            if (!expensesByDate[dateString]) expensesByDate[dateString] = 0;
            expensesByDate[dateString] += parseFloat(expense.jumlah || 0);
          });

          // Process chart data
          const dates = new Set();
          
          // Add all dates from income data
          if (incomeChartData && incomeChartData.length) {
            incomeChartData.forEach(item => {
              if (item.date) {
                const dateStr = new Date(item.date).toISOString().split('T')[0];
                dates.add(dateStr);
              }
            });
          }
          
          // Add all dates from expense data
          Object.keys(expensesByDate).forEach(date => dates.add(date));
          
          // Sort dates
          const sortedDates = Array.from(dates).sort();

          // Create data arrays for chart
          const chartLabels = [];
          const chartIncome = [];
          const chartExpense = [];

          sortedDates.forEach(date => {
            chartLabels.push(new Date(date).toLocaleDateString('id-ID'));
            
            // Find income for this date
            const incomeEntry = incomeChartData && incomeChartData.find(item => 
              item.date && new Date(item.date).toISOString().split('T')[0] === date);
            chartIncome.push(incomeEntry ? parseFloat(incomeEntry.dailyIncome) : 0);
            
            // Find expense for this date
            chartExpense.push(expensesByDate[date] || 0);
          });

          // Prepare response data
          const financialData = {
            income: totalIncome,
            expense: totalExpense,
            profit: profit,
            expenses: expenses,
            chartData: {
              labels: chartLabels,
              income: chartIncome,
              expense: chartExpense
            }
          };

          return responsAPI(200, financialData, 'Berhasil mendapatkan data keuangan', res);
        } catch (processError) {
          console.error('Error processing financial data:', processError);
          return responsAPI(500, 'Error processing data', `Error: ${processError.message}`, res);
        }
      });
    }
  } catch (error) {
    console.error('Unexpected error in processFinancialData:', error);
    return responsAPI(500, 'Unexpected error', `Error: ${error.message}`, res);
  }
}

exports.addExpense = (req, res) => {
  const { tanggal, keterangan, jumlah, kategori } = req.body;

  if (!tanggal || !keterangan || !jumlah || !kategori) {
    return responsAPI(400, 'Missing required fields', 'Semua field harus diisi', res);
  }

  const sql = 'INSERT INTO pengeluaran (tanggal, keterangan, jumlah, kategori) VALUES (?, ?, ?, ?)';
  db.query(sql, [tanggal, keterangan, jumlah, kategori], (err, result) => {
    if (err) {
      return responsAPI(500, 'Failed to add expense', `Error: ${err}`, res);
    }
    return responsAPI(201, result, 'Pengeluaran berhasil ditambahkan', res);
  });
};