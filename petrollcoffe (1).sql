-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table patrolcoffe.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `idAdmin` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `namaAdmin` varchar(255) NOT NULL,
  PRIMARY KEY (`idAdmin`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table patrolcoffe.admin: ~2 rows (approximately)
INSERT INTO `admin` (`idAdmin`, `username`, `password`, `namaAdmin`) VALUES
	(1, 'gibfathoni', 'pass123', 'Gibran Fathoni B'),
	(2, 'alpan', 'alpan123', 'Ahmad Alfan');

-- Dumping structure for table patrolcoffe.foto
CREATE TABLE IF NOT EXISTS `foto` (
  `idFoto` int NOT NULL AUTO_INCREMENT,
  `link` text NOT NULL,
  PRIMARY KEY (`idFoto`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table patrolcoffe.foto: ~2 rows (approximately)
INSERT INTO `foto` (`idFoto`, `link`) VALUES
	(13, '1737144672010-images (5).jpeg'),
	(14, '1737150682622-cara-membuat-kentang-goreng-reny-20230204071836.jpg');

-- Dumping structure for table patrolcoffe.karyawan
CREATE TABLE IF NOT EXISTS `karyawan` (
  `idKaryawan` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `namaKaryawan` varchar(255) NOT NULL,
  PRIMARY KEY (`idKaryawan`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table patrolcoffe.karyawan: ~2 rows (approximately)
INSERT INTO `karyawan` (`idKaryawan`, `username`, `password`, `namaKaryawan`) VALUES
	(3, 'gibFB', 'pass123', 'Gibran FB'),
	(4, 'agusNih', 'pass123', 'Agus Lapar');

-- Dumping structure for table patrolcoffe.listitem
CREATE TABLE IF NOT EXISTS `listitem` (
  `idTransaksi` int NOT NULL,
  `idProduk` int NOT NULL,
  `jumlah` int NOT NULL,
  PRIMARY KEY (`idTransaksi`,`idProduk`) USING BTREE,
  KEY `FK_produk` (`idProduk`),
  CONSTRAINT `FK_produk` FOREIGN KEY (`idProduk`) REFERENCES `produk` (`idProduk`) ON DELETE CASCADE,
  CONSTRAINT `FK_transaksi` FOREIGN KEY (`idTransaksi`) REFERENCES `transaksi` (`idTRX`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table patrolcoffe.listitem: ~0 rows (approximately)

-- Dumping structure for view patrolcoffe.product
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `product` (
	`idProduk` INT(10) NOT NULL,
	`namaProduk` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`harga` DECIMAL(10,2) NOT NULL,
	`kategori` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`link` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for table patrolcoffe.produk
CREATE TABLE IF NOT EXISTS `produk` (
  `idProduk` int NOT NULL AUTO_INCREMENT,
  `namaProduk` varchar(255) NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `harga` decimal(10,2) NOT NULL DEFAULT '0.00',
  `linkFoto` int DEFAULT NULL,
  PRIMARY KEY (`idProduk`),
  KEY `FK_produk_foto` (`linkFoto`),
  CONSTRAINT `FK_produk_foto` FOREIGN KEY (`linkFoto`) REFERENCES `foto` (`idFoto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table patrolcoffe.produk: ~2 rows (approximately)
INSERT INTO `produk` (`idProduk`, `namaProduk`, `kategori`, `harga`, `linkFoto`) VALUES
	(20, 'Cappuchino', 'coffe', 14000.00, 13),
	(21, 'Kentang Goreng', 'snack', 12000.00, 14);

-- Dumping structure for view patrolcoffe.riwayat
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `riwayat` (
	`id_transaksi` INT(10) NOT NULL,
	`tanggal_transaksi` DATETIME NOT NULL,
	`nama_kasir` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,2) NULL,
	`metode_bayar` ENUM('Tunai','Non Tunai') NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for table patrolcoffe.transaksi
CREATE TABLE IF NOT EXISTS `transaksi` (
  `idTRX` int NOT NULL AUTO_INCREMENT,
  `tanggal` datetime NOT NULL,
  `metodeBayar` enum('Tunai','Non Tunai') NOT NULL DEFAULT 'Tunai',
  `namakaryawan` varchar(50) NOT NULL,
  PRIMARY KEY (`idTRX`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table patrolcoffe.transaksi: ~1 rows (approximately)
INSERT INTO `transaksi` (`idTRX`, `tanggal`, `metodeBayar`, `namakaryawan`) VALUES
	(13, '2025-01-11 08:09:45', 'Tunai', '1');

-- Dumping structure for view patrolcoffe.product
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `product`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `product` AS select `p`.`idProduk` AS `idProduk`,`p`.`namaProduk` AS `namaProduk`,`p`.`harga` AS `harga`,`p`.`kategori` AS `kategori`,`f`.`link` AS `link` from (`produk` `p` left join `foto` `f` on((`p`.`linkFoto` = `f`.`idFoto`)));

-- Dumping structure for view patrolcoffe.riwayat
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `riwayat`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `riwayat` AS select `t`.`idTRX` AS `id_transaksi`,`t`.`tanggal` AS `tanggal_transaksi`,`t`.`namakaryawan` AS `nama_kasir`,sum((`p`.`harga` * `li`.`jumlah`)) AS `total`,`t`.`metodeBayar` AS `metode_bayar` from ((`transaksi` `t` join `listitem` `li` on((`t`.`idTRX` = `li`.`idTransaksi`))) join `produk` `p` on((`li`.`idProduk` = `p`.`idProduk`))) group by `t`.`idTRX`,`t`.`tanggal`,`t`.`namakaryawan`,`t`.`metodeBayar`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
