import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { v4 as uuidv4 } from 'uuid';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State Dialog & Form
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', phone: '', email: '' });
  
  // State untuk Error Validasi (Real-time)
  const [errors, setErrors] = useState({});

  // State Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // 1. READ
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

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // --- LOGIKA VALIDASI REAL-TIME ---
  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = 'Email wajib diisi';
      else if (!emailRegex.test(value)) errorMsg = 'Format email salah (contoh: user@mail.com)';
    }

    if (name === 'phone') {
      const phoneRegex = /^[0-9]+$/;
      if (!value) errorMsg = 'No HP wajib diisi';
      else if (!phoneRegex.test(value)) errorMsg = 'Hanya boleh angka';
      else if (value.length < 10) errorMsg = 'Minimal 10 digit';
      else if (value.length > 15) errorMsg = 'Maksimal 15 digit';
    }

    if (name === 'name') {
      if (!value.trim()) errorMsg = 'Nama wajib diisi';
    }

    return errorMsg;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    const errorMsg = validateField(field, value);

    setErrors(prev => {
      const newErrors = { ...prev };
      if (errorMsg) {
        newErrors[field] = errorMsg;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  // Cek validasi keseluruhan sebelum simpan
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

  // 2. CREATE & UPDATE
  const handleSave = async () => {
    if (!validateAll()) return false; 

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
      console.error("Gagal menyimpan:", error);
      showSnackbar('Gagal menyimpan data', 'error');
      return false;
    }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      showSnackbar('Customer berhasil dihapus');
      fetchCustomers();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      showSnackbar('Gagal menghapus data', 'error');
    }
  };

  // UI Helpers
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ id: '', name: '', phone: '', email: '' });
    setErrors({}); 
    setOpenDialog(true);
  };

  const handleOpenEdit = (customer) => {
    setIsEditMode(true);
    setFormData(customer);
    setErrors({}); 
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  return {
    customers, loading, openDialog, isEditMode, formData,
    errors, 
    snackbar, showSnackbar, closeSnackbar,
    handleOpenAdd, handleOpenEdit, handleCloseDialog, handleFormChange,
    handleSave, handleDelete
  };
};