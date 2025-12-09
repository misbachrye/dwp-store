import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Stack, LinearProgress, Snackbar, Alert, InputAdornment, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Import Hook
import { useCustomers } from "../hooks/useCustomers";
import TransactionModal from "./TransactionModal";
import ConfirmDialog from "../components/ConfirmDialog";

const CustomerPage = () => {
  const {
    filteredCustomers, loading, searchText, setSearchText,
    openDialog, isEditMode, formData, errors,
    handleOpenAdd, handleOpenEdit, handleCloseDialog, handleFormChange, handleSave,
    deleteOpen, handleOpenDelete, handleCloseDelete, handleDelete,
    openTrx, selectedCustomer, handleOpenTrx, handleCloseTrx,
    snackbar, closeSnackbar, showSnackbar
  } = useCustomers();

  const columns = [
    { field: "name", headerName: "Nama Customer", flex: 1, minWidth: 150 },
    { field: "phone", headerName: "No. HP", width: 150 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
    {
      field: "actions", headerName: "Aksi", width: 350, sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" height="100%">
          <Button variant="contained" size="small" color="success" startIcon={<ShoppingCartIcon />} onClick={() => handleOpenTrx(params.row)}>
            Beli
          </Button>
          <Button variant="contained" size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenEdit(params.row)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleOpenDelete(params.row.id)}>
            Hapus
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenAdd}>Tambah Customer</Button>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
          <TextField
            size="small" placeholder="Cari nama, email, hp..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ minWidth: 250 }}
          />
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={() => setSearchText("")}>Reset</Button>
        </Box>
      </Stack>

      <DataGrid rows={filteredCustomers} columns={columns} pageSize={5} rowHeight={60} loading={loading} slots={{ loadingOverlay: LinearProgress }} disableRowSelectionOnClick />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? "Edit Customer" : "Tambah Customer Baru"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nama" fullWidth value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} error={!!errors.name} helperText={errors.name} />
          <TextField margin="dense" label="No HP" fullWidth value={formData.phone} onChange={(e) => handleFormChange("phone", e.target.value)} error={!!errors.phone} helperText={errors.phone} />
          <TextField margin="dense" label="Email" fullWidth value={formData.email} onChange={(e) => handleFormChange("email", e.target.value)} error={!!errors.email} helperText={errors.email} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSave} variant="contained" disabled={Object.keys(errors).length > 0}>{isEditMode ? "Update" : "Simpan"}</Button>
        </DialogActions>
      </Dialog>

      {openTrx && selectedCustomer && (
        <TransactionModal open={openTrx} onClose={handleCloseTrx} customer={selectedCustomer} onSuccess={(msg) => showSnackbar(msg, "success")} />
      )}

      <ConfirmDialog open={deleteOpen} title="Hapus Customer" content="Apakah Anda yakin ingin menghapus customer ini?" confirmText="Hapus" danger={true} onCancel={handleCloseDelete} onConfirm={handleDelete} />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default CustomerPage;