import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import api from '../api/axiosInstance';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialog from '../components/ConfirmDialog';

const TransactionModal = ({ open, onClose, customer, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const onBuyClick = (product) => {
    setSelectedProduct(product);
    setConfirmOpen(true);
  };

  const handleConfirmBuy = async () => {
    try {
      const transaction = {
        id: uuidv4(),
        customerId: customer.id,
        customerName: customer.name,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        date: new Date().toLocaleString()
      };
      await api.post('/transactions', transaction);
      setConfirmOpen(false);
      onClose();
      onSuccess(`Berhasil membeli paket ${selectedProduct.name}!`);
    } catch (err) {
      console.error(err);
      alert('Gagal transaksi');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Pilih Paket Data untuk: <b>{customer.name}</b></DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {products.map((product) => (
              <Grid item xs={12} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>{product.description}</Typography>
                    <Typography variant="h5" color="primary">Rp {product.price.toLocaleString()}</Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button fullWidth variant="contained" onClick={() => onBuyClick(product)}>
                      Beli Paket Ini
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Tutup</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog 
        open={confirmOpen}
        title="Konfirmasi Pembelian"
        content={`Apakah Anda yakin ingin membeli paket ${selectedProduct?.name}?`}
        confirmText="Beli Sekarang"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmBuy}
      />
    </>
  );
};

export default TransactionModal;