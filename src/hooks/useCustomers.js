import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosInstance';
import { v4 as uuidv4 } from 'uuid';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // State baru untuk loading aksi simpan/hapus
  const [searchText, setSearchText] = useState("");
  
  // State Dialog & Form
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', phone: '', email: '' });
  
  // State UI Tambahan (Delete & Transaksi)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [openTrx, setOpenTrx] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State Error & Snackbar
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // --- Logic Filtering ---
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const lowerText = searchText.toLowerCase();
      return (
        customer.name.toLowerCase().includes(lowerText) ||
        customer.email.toLowerCase().includes(lowerText) ||
        customer.phone.includes(lowerText)
      );
    });
  }, [customers, searchText]);

  // --- CRUD Operations ---
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = 'Email wajib diisi';
      else if (!emailRegex.test(value)) errorMsg = 'Format email salah';
    }
    if (name === 'phone') {
      const phoneRegex = /^[0-9]+$/;
      if (!value) errorMsg = 'No HP wajib diisi';
      else if (!phoneRegex.test(value)) errorMsg = 'Hanya boleh angka';
      else if (value.length < 10) errorMsg = 'Minimal 10 digit';
    }
    if (name === 'name' && !value.trim()) errorMsg = 'Nama wajib diisi';
    return errorMsg;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const errorMsg = validateField(field, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (errorMsg) newErrors[field] = errorMsg; else delete newErrors[field];
      return newErrors;
    });
  };

  const validateAll = () => {
    const newErrors = {};
    const errName = validateField('name', formData.name);
    const errEmail = validateField('email', formData.email);
    const errPhone = validateField('phone', formData.phone);
    if (errName) newErrors.name = errName;
    if (errEmail) newErrors.email = errEmail;
    if (errPhone) newErrors.phone = errPhone;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAll()) return false;
    setActionLoading(true); // Mulai loading simpan
    try {
      if (isEditMode) {
        await api.put(`/customers/${formData.id}`, formData);
        showSnackbar('Data berhasil diperbarui');
      } else {
        await api.post('/customers', { ...formData, id: uuidv4() });
        showSnackbar('Customer baru berhasil ditambahkan');
      }
      setOpenDialog(false);
      fetchCustomers();
      return true;
    } catch (error) {
      showSnackbar('Gagal menyimpan data', error);
      return false;
    } finally {
      setActionLoading(false); // Selesai loading simpan
    }
  };

  const handleDelete = async () => {
    setActionLoading(true); // Mulai loading hapus
    try {
      await api.delete(`/customers/${deleteTargetId}`);
      showSnackbar('Customer berhasil dihapus');
      setDeleteOpen(false);
      fetchCustomers();
    } catch (error) {
      showSnackbar('Gagal menghapus data', error);
    } finally {
      setActionLoading(false); // Selesai loading hapus
    }
  };

  // --- UI Action Handlers ---
  const handleOpenAdd = () => { setIsEditMode(false); setFormData({ id: '', name: '', phone: '', email: '' }); setErrors({}); setOpenDialog(true); };
  const handleOpenEdit = (customer) => { setIsEditMode(true); setFormData(customer); setErrors({}); setOpenDialog(true); };
  const handleCloseDialog = () => setOpenDialog(false);
  
  const handleOpenDelete = (id) => { setDeleteTargetId(id); setDeleteOpen(true); };
  const handleCloseDelete = () => setDeleteOpen(false);

  const handleOpenTrx = (customer) => { setSelectedCustomer(customer); setOpenTrx(true); };
  const handleCloseTrx = () => setOpenTrx(false);

  return {
    // Data
    filteredCustomers, loading, actionLoading, // Return actionLoading
    // Search
    searchText, setSearchText,
    // Add/Edit Form
    openDialog, isEditMode, formData, errors, handleOpenAdd, handleOpenEdit, handleCloseDialog, handleFormChange, handleSave,
    // Delete Actions
    deleteOpen, handleOpenDelete, handleCloseDelete, handleDelete,
    // Trx Actions
    openTrx, selectedCustomer, handleOpenTrx, handleCloseTrx,
    // Snackbar
    snackbar, showSnackbar, closeSnackbar
  };
};