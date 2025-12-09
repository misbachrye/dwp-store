import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Stack, TextField, InputAdornment, Button, Typography, Box, Popover, FormControl, InputLabel, Select, MenuItem, Grid, Divider, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

// Import Hook Baru
import { useTransactions } from "../hooks/useTransactions";

const TransactionHistory = () => {
  // Panggil Logic dari Hook
  const {
    filteredTrxs, uniquePackages,
    searchText, setSearchText,
    anchorEl, openFilter, handleFilterClick, handleFilterClose,
    dateFilter, setDateFilter,
    packageFilter, setPackageFilter,
    priceRange, setPriceRange, handleResetFilter,
    handleExportGeneral, 
    handleExportSingle
  } = useTransactions();

  const columns = [
    { field: "date", headerName: "Tanggal", width: 220 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    { field: "productName", headerName: "Paket", flex: 1 },
    { field: "price", headerName: "Harga", width: 150, renderCell: (params) => `Rp ${params.value?.toLocaleString("id-ID")}` },
    {
      field: "actions", headerName: "Aksi", width: 100, sortable: false,
      renderCell: (params) => (
        <Tooltip title="Download Transaksi Ini">
          <IconButton 
            color="primary" 
            onClick={() => handleExportSingle(params.row)}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Riwayat Transaksi</Typography>
        <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", md: "auto" }, mt: { xs: 2, md: 0 }, flexWrap: "wrap" }}>
          <TextField
            size="small" placeholder="Cari customer..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ minWidth: { xs: '100%', md: 250 } }}
          />
          <Button
            variant="outlined" startIcon={<FilterListIcon />} onClick={handleFilterClick}
            sx={{
              borderColor: "primary.main", color: "primary.main",
              ...(openFilter && { backgroundColor: "primary.main", color: "white", borderColor: "primary.main", "&:hover": { backgroundColor: "primary.dark" } }),
            }}
          >
            Filter
          </Button>
          <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={handleExportGeneral}>
            Export All
          </Button>
        </Box>
      </Stack>

      <Popover
        open={openFilter} anchorEl={anchorEl} onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 320, p: 2 } }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">Filter Data</Typography>
            <IconButton size="small" onClick={handleFilterClose}><CloseIcon /></IconButton>
          </Stack>
          <Divider />
          <FormControl size="small" fullWidth>
            <InputLabel>Waktu Transaksi</InputLabel>
            <Select value={dateFilter} label="Waktu Transaksi" onChange={(e) => setDateFilter(e.target.value)}>
              <MenuItem value="all">Semua Waktu</MenuItem>
              <MenuItem value="today">Hari Ini</MenuItem>
              <MenuItem value="week">Minggu Ini</MenuItem>
              <MenuItem value="month">Bulan Ini</MenuItem>
              <MenuItem value="year">Tahun Ini</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Jenis Paket</InputLabel>
            <Select value={packageFilter} label="Jenis Paket" onChange={(e) => setPackageFilter(e.target.value)}>
              <MenuItem value="all">Semua Paket</MenuItem>
              {uniquePackages.map((pkg, index) => (<MenuItem key={index} value={pkg}>{pkg}</MenuItem>))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>Range Harga</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField label="Min" size="small" type="number" fullWidth value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} InputProps={{ startAdornment: <Typography variant="caption" sx={{ mr: 0.5 }}>Rp</Typography> }} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Max" size="small" type="number" fullWidth value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} InputProps={{ startAdornment: <Typography variant="caption" sx={{ mr: 0.5 }}>Rp</Typography> }} />
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button 
                variant="outlined" size="small" startIcon={<FilterAltOffIcon />} onClick={handleResetFilter} 
                sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(25, 118, 210, 0.04)' }, '&:active': { backgroundColor: 'primary.main', color: 'white' } }}
            >
                Reset
            </Button>
            <Button variant="contained" size="small" onClick={handleFilterClose}>Terapkan</Button>
          </Stack>
        </Stack>
      </Popover>

      <DataGrid rows={filteredTrxs} columns={columns} disableRowSelectionOnClick pageSize={10} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[10, 25, 50]} />
    </div>
  );
};

export default TransactionHistory;