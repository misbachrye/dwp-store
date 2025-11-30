import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/axiosInstance';

const TransactionHistory = () => {
  const [trxs, setTrxs] = useState([]);

  useEffect(() => {
    api.get('/transactions').then(res => setTrxs(res.data));
  }, []);

  const columns = [
    { 
      field: 'date', 
      headerName: 'Tanggal', 
      width: 220    
    },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      flex: 1      
    },
    { 
      field: 'productName', 
      headerName: 'Paket', 
      flex: 1       
    },
    { 
      field: 'price', 
      headerName: 'Harga', 
      width: 150     
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Riwayat Transaksi</h2>
      <DataGrid rows={trxs} columns={columns} />
    </div>
  );
};

export default TransactionHistory;