const {db} = require('../infrastructure/database/connection');
const responsAPI = require('../infrastructure/reponse');


exports.isAuthicated = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/loginpage')
    }
    if (!db || typeof db.query !== 'function') {
        console.error('Database connection not properly initialized');
        return responsAPI(500, 'Database connection error', 'Internal Server Error', res);
    }

    // Query admin
    db.query(
        'SELECT * FROM admin WHERE username = ? AND password = ?',
        [username, password],
        (err, adminResult) => {
            if (err) {
                return responsAPI(500, 'Failed to authenticate', 'Internal Server Error', res);
            }

            if (adminResult.length > 0) {
                // Simpan data ke session
                req.session.user = {
                    id: adminResult[0].idAdmin,
                    username: adminResult[0].username,
                    name: adminResult[0].namaAdmin,
                    role: 'admin',
                };
                console.log(req.session.user)
                return res.redirect('/admin/dashboard')
            }

            // Query karyawan jika admin tidak ditemukan
            db.query(
                'SELECT * FROM karyawan WHERE username = ? AND password = ?',
                [username, password],
                (err, karyawanResult) => {
                    if (err) {
                        return responsAPI(500, 'Failed to authenticate', 'Internal Server Error', res);
                    }

                    if (karyawanResult.length > 0) {
                        // Simpan data ke session
                        req.session.user = {
                            id: karyawanResult[0].idKaryawan,
                            username: karyawanResult[0].username,
                            name: karyawanResult[0].namaKaryawan,
                            role: 'karyawan',
                        };
                        
                    return res.redirect('/karyawan/dashboard')
                    }

                    // Jika tidak ada user yang ditemukan
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials',
                        redirectUrl: '/login',
                    });
                }
            );
        }
    );
};

exports.validateKaryawan = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'karyawan') {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.validateAdmin = (req, res, next) => {
  // Check if session exists and user is logged in
  if (!req.session || !req.session.user) {
    console.log('No session or user found, redirecting to login');
    return res.redirect('/login');
  }
  
  // Verify the user has admin role
  if (req.session.user.role !== 'admin') {
    console.log('User is not an admin, redirecting');
    return res.redirect('/login');
  }
  
  // Add a session expiry check (optional)
  if (req.session.lastActive) {
    const currentTime = Date.now();
    // If session has been inactive for more than 30 minutes (1800000 ms)
    if (currentTime - req.session.lastActive > 1800000) {
      req.session.destroy();
      return res.redirect('/login?expired=true');
    }
  }
  
  // Update last active timestamp
  req.session.lastActive = Date.now();
  
  next();
};

exports.validateKasir = (req, res, next) => {
  // Similar check for kasir role
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  
  // Update last active timestamp
  req.session.lastActive = Date.now();
  
  next();
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out');
      }
      res.redirect('/login')
    });
  };