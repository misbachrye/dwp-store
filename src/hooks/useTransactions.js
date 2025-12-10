import { useState, useEffect, useMemo } from "react";
import api from "../api/axiosInstance";

export const useTransactions = () => {
  const [trxs, setTrxs] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  // PERBAIKAN: Set initial state menjadi true
  // Agar tidak perlu memanggil setLoading(true) di dalam useEffect
  const [loading, setLoading] = useState(true); 

  // State Filter
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // 1. Fetch Data
  useEffect(() => {
    // PERBAIKAN: Hapus setLoading(true) dari sini
    api.get("/transactions")
      .then((res) => setTrxs(res.data))
      .catch((err) => console.error("Gagal ambil transaksi:", err))
      .finally(() => setLoading(false)); // setLoading(false) tetap ada untuk mengakhiri loading
  }, []);

  // 2. Daftar Paket Unik
  const uniquePackages = useMemo(() => {
    const packages = trxs.map((t) => t.productName).filter(Boolean);
    return [...new Set(packages)];
  }, [trxs]);

  // 3. Logic Filter Utama
  const filteredTrxs = useMemo(() => {
    return trxs.filter((trx) => {
      const trxDate = new Date(trx.date);
      const now = new Date();

      // Filter Search
      const lowerText = searchText.toLowerCase();
      const matchesSearch = trx.customerName && trx.customerName.toLowerCase().includes(lowerText);

      // Filter Tanggal
      let matchesDate = true;
      if (dateFilter !== "all") {
        const target = new Date(trxDate);
        target.setHours(0, 0, 0, 0);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        if (dateFilter === "today") {
          matchesDate = target.getTime() === today.getTime();
        } else if (dateFilter === "week") {
          const firstDay = new Date(today);
          firstDay.setDate(today.getDate() - today.getDay());
          const lastDay = new Date(firstDay);
          lastDay.setDate(firstDay.getDate() + 6);
          matchesDate = target >= firstDay && target <= lastDay;
        } else if (dateFilter === "month") {
          matchesDate = target.getMonth() === today.getMonth() && target.getFullYear() === today.getFullYear();
        } else if (dateFilter === "year") {
          matchesDate = target.getFullYear() === today.getFullYear();
        }
      }

      // Filter Paket
      let matchesPackage = true;
      if (packageFilter !== "all") {
        matchesPackage = trx.productName === packageFilter;
      }

      // Filter Harga
      let matchesPrice = true;
      const price = trx.price || 0;
      const min = priceRange.min !== "" ? parseInt(priceRange.min) : 0;
      const max = priceRange.max !== "" ? parseInt(priceRange.max) : Infinity;
      matchesPrice = price >= min && price <= max;

      return matchesSearch && matchesDate && matchesPackage && matchesPrice;
    });
  }, [trxs, searchText, dateFilter, packageFilter, priceRange]);

  // 4. Logic Export CSV
  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }
    const headers = "ID Transaksi,Tanggal,Waktu,Customer,Paket Data,Harga";
    const rows = data.map((trx) => {
      const dateObj = new Date(trx.date);
      const cleanName = `"${(trx.customerName || '').replace(/"/g, '""')}"`;
      const cleanPkg = `"${(trx.productName || '').replace(/"/g, '""')}"`;
      return `${trx.id},${dateObj.toLocaleDateString('id-ID')},${dateObj.toLocaleTimeString('id-ID')},${cleanName},${cleanPkg},${trx.price}`;
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export General
  const handleExportGeneral = () => {
    downloadCSV(filteredTrxs, `Laporan_Transaksi_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Export Single
  const handleExportSingle = (trx) => {
    const singleData = [trx]; 
    const safeName = trx.customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Invoice_${safeName}_${trx.id.substring(0, 8)}.csv`;
    downloadCSV(singleData, filename);
  };

  // UI Handlers
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);
  const handleResetFilter = () => {
    setDateFilter("all");
    setPackageFilter("all");
    setPriceRange({ min: "", max: "" });
  };

  return {
    trxs, filteredTrxs, uniquePackages,
    searchText, setSearchText,
    loading, 
    anchorEl, openFilter: Boolean(anchorEl), handleFilterClick, handleFilterClose,
    dateFilter, setDateFilter,
    packageFilter, setPackageFilter,
    priceRange, setPriceRange, handleResetFilter,
    handleExportGeneral, 
    handleExportSingle
  };
};