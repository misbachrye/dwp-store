import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Stack, LinearProgress, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useCustomers } from '../hooks/useCustomers'; 
import TransactionModal from './TransactionModal';
import ConfirmDialog from '../components/ConfirmDialog';

const CustomerPage = () => {
  const {
    customers, loading, openDialog, isEditMode, formData,
    errors,
    snackbar, closeSnackbar, showSnackbar, 
    handleOpenAdd, handleOpenEdit, handleCloseDialog, handleFormChange, handleSave, handleDelete
  } = useCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openTrx, setOpenTrx] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const onDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteOpen(true);
  };

  const onConfirmDelete = async () => {
    await handleDelete(deleteTargetId);
    setDeleteOpen(false);
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Nama Customer', 
      flex: 1,     
      minWidth: 150 
    },
    { 
      field: 'phone', 
      headerName: 'No. HP', 
      width: 150    
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1.5, 
      minWidth: 200 
    },
    {
      field: 'actions', 
      headerName: 'Aksi', 
      width: 350,  
      sortable: false, 
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" height="100%">
          <Button variant="contained" size="small" color="success" startIcon={<ShoppingCartIcon />}
            onClick={() => { setSelectedCustomer(params.row); setOpenTrx(true); }}
          >Beli</Button>
          <Button variant="contained" size="small" color="primary" startIcon={<EditIcon />}
            onClick={() => handleOpenEdit(params.row)}
          >Edit</Button>
          <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />}
            onClick={() => onDeleteClick(params.row.id)}
          >Hapus</Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Button startIcon={<AddIcon/>} variant="contained" onClick={handleOpenAdd} sx={{ mb: 2 }}>
        Tambah Customer
      </Button>
      
      <DataGrid 
        rows={customers} 
        columns={columns} 
        pageSize={5} 
        rowHeight={60} 
        loading={loading} 
        slots={{ loadingOverlay: LinearProgress }} 
      />

      {/* Modal Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? 'Edit Customer' : 'Tambah Customer Baru'}</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus margin="dense" label="Nama" fullWidth 
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            error={!!errors.name} helperText={errors.name}
          />
          <TextField 
            margin="dense" label="No HP" fullWidth 
            value={formData.phone}
            onChange={(e) => handleFormChange('phone', e.target.value)}
            error={!!errors.phone} helperText={errors.phone}
          />
          <TextField 
            margin="dense" label="Email" fullWidth 
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            error={!!errors.email} helperText={errors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSave} variant="contained" disabled={Object.keys(errors).length > 0}>
            {isEditMode ? 'Update' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Transaksi */}
      {openTrx && selectedCustomer && (
        <TransactionModal open={openTrx} onClose={() => setOpenTrx(false)} 
          customer={selectedCustomer} onSuccess={(msg) => showSnackbar(msg, 'success')} 
        />
      )}

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog 
        open={deleteOpen} title="Hapus Customer"
        content="Apakah Anda yakin ingin menghapus customer ini?"
        confirmText="Hapus" danger={true}
        onCancel={() => setDeleteOpen(false)} onConfirm={onConfirmDelete}
      />

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomerPage;