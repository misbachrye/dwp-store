# DWP Data Store Application

Aplikasi web sederhana untuk manajemen pelanggan dan transaksi penjualan paket data. Project ini dibangun menggunakan React (Vite) sebagai frontend dan JSON-Server sebagai simulasi backend REST API.

## ⏱️ Estimasi Waktu Pengerjaan

Proyek ini diselesaikan dalam waktu kurang lebih **8-10 Jam di hari sabtu dan minggu**.

## 🌟 Tampilan Aplikasi (Screenshots)

Berikut adalah antarmuka utama dari aplikasi ini:

### 1. Halaman Login
*Halaman autentikasi untuk masuk ke dalam sistem.*
![Halaman Login](./screenshots/halaman-login.png)

### 2. Dashboard / Manajemen Customer
*Menampilkan daftar pelanggan, fitur pencarian, dan tombol aksi.*
![Dashboard Customer](./screenshots/dashboard-customer.png)

### 3. Tambah Customer
*Interface untuk menambahkan customer baru.*
![Tambah Customer](./screenshots/tambah-customer.png)

### 4. Transaksi Beli Paket
*Interface untuk memilih dan membeli paket data bagi pelanggan.*
![Transaksi Beli Paket](./screenshots/beli-paket.png)

### 5. Konfirmasi Transaksi
*Interface untuk mengonfirmasi pembelian paket data bagi pelanggan.*
![Konfirmasi Transaksi](./screenshots/konfirmasi-beli-paket.png)

### 6. Edit Customer
*Interface untuk mengedit data pelanggan.*
![Edit Customer](./screenshots/edit-customer.png)

### 7. Sukses Edit Customer
*Interface untuk alert bahwa edit data pelanggan sukses.*
![Sukses Edit Customer](./screenshots/success-edit-customer.png)

### 8. Hapus Customer
*Interface untuk menghapus data pelanggan.*
![Hapus Customer](./screenshots/hapus-customer.png)

### 9. Riwayat Transaksi
*Interface untuk menghapus data pelanggan.*
![Riwayat Transaksi](./screenshots/riwayat-transaksi.png)

### 10. Konfirmasi Logout
*Interface untuk mengonfirmasi sebelum logout.*
![Konfirmasi Logout](./screenshots/konfirmasi-logout.png)

---

## 🌟 Fitur Utama

Aplikasi ini mencakup beberapa fungsionalitas utama:

1.  **Autentikasi Pengguna**:
    * Halaman login sederhana untuk staff/admin.
    * Proteksi rute (Private Routes) menggunakan React Context.
2.  **Manajemen Pelanggan (CRUD)**:
    * Menampilkan daftar pelanggan dalam tabel.
    * Menambah pelanggan baru dengan validasi input real-time.
    * Mengedit data pelanggan yang sudah ada.
    * Menghapus data pelanggan dengan dialog konfirmasi.
3.  **Transaksi Pembelian**:
    * Modal khusus untuk memilih paket data bagi pelanggan tertentu.
    * Integrasi data produk dari database.
    * Konfirmasi pembelian sebelum eksekusi.
4.  **Riwayat Transaksi**:
    * Mencatat dan menampilkan log histori pembelian yang telah berhasil dilakukan.
5.  **UI/UX Modern**:
    * Menggunakan **Material UI (MUI)** untuk tampilan yang responsif dan konsisten.
    * Feedback pengguna menggunakan Snackbar (notifikasi sukses/gagal).

## 🛠️ Teknologi yang Digunakan

* **Core**: [React](https://react.dev/) (v19), [Vite](https://vitejs.dev/)
* **UI Framework**: [Material UI (MUI)](https://mui.com/) v7
* **Routing**: [React Router DOM](https://reactrouter.com/) v7
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Backend Simulation**: [JSON Server](https://github.com/typicode/json-server)
* **State Management**: React Context API & Custom Hooks
* **Utilities**: UUID (untuk generate ID)

## 📋 Prasyarat

Sebelum memulai, pastikan komputer Anda telah terinstal:

* [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru disarankan)
* NPM (Node Package Manager)

## 🚀 Instalasi dan Cara Menjalankan

Project ini membutuhkan dua proses terminal yang berjalan secara paralel (satu untuk Backend, satu untuk Frontend).

### 1. Clone Repository & Install Dependencies

```bash
# Clone repository ini
git clone [https://github.com/misbachrye/dwp-store.git](https://github.com/misbachrye/dwp-store.git)

# Masuk ke direktori project
cd dwp-test

# Install semua dependencies
npm install
```

### 2. Jalankan Backend (JSON Server)
Buka terminal pertama, lalu jalankan perintah berikut untuk mengaktifkan mock API pada port 3001:
```bash
npm run server
```

### 3. Jalankan Frontend (Vite)
Buka terminal kedua (tab baru), lalu jalankan perintah berikut untuk menjalankan aplikasi React:
```bash
npm run dev
```

## 🔐 Akun Demo
Gunakan kredensial berikut untuk masuk ke dalam aplikasi:
```bash
Username : admin
Password : password123
```

## Struktur Project
```
dwp-test/
├── db.json                  # Database simulasi (Users, Customers, Products, Transactions)
├── screenshots/             # Folder untuk menyimpan gambar dokumentasi
│   ├── halaman-login.png
│   ├── dashboard-customer.png
│   └── ...
├── src/
│   ├── api/
│   │   └── axiosInstance.js # Konfigurasi Axios Base URL
│   ├── components/
│   │   ├── ConfirmDialog.jsx # Komponen dialog konfirmasi reusable
│   │   ├── Layout.jsx        # Template utama (Navbar & Container)
│   │   └── TableSkeleton.jsx # Loading state untuk tabel
│   ├── context/
│   │   └── AuthContext.jsx   # Context untuk global state login/logout
│   ├── hooks/
│   │   └── useCustomers.js   # Custom hook logic CRUD Customer
│   ├── pages/
│   │   ├── CustomerPage.jsx       # Halaman utama manajemen customer
│   │   ├── LoginPage.jsx          # Halaman login
│   │   ├── TransactionHistory.jsx # Halaman riwayat transaksi
│   │   └── TransactionModal.jsx   # Modal pembelian paket
│   ├── App.jsx              # Main routing configuration
│   └── main.jsx             # Entry point React
├── package.json
└── vite.config.js
```