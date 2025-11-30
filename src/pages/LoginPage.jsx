import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert, IconButton, InputAdornment, Container } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [input, setInput] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/users?username=${input.username}&password=${input.password}`);
      if (res.data.length > 0) {
        login(res.data[0]);
        navigate('/');
      } else {
        setError('Username atau password salah');
      }
    } catch (err) {
      console.error("Login Error:", err); 
      setError('Terjadi kesalahan server');
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1565C0 30%, #42A5F5 90%)'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ 
          p: 4, 
          borderRadius: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.95)' // Sedikit transparan
        }}>
          <Box sx={{ 
            m: 1, 
            bgcolor: 'primary.main', 
            borderRadius: '50%', 
            p: 2, 
            mb: 2,
            display: 'flex'
          }}>
            <LockOutlined sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          
          <Typography component="h1" variant="h5" fontWeight="bold" color="primary">
            Login Staff
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Silakan masuk untuk melanjutkan
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField 
              fullWidth label="Username" margin="normal" variant="outlined"
              value={input.username} onChange={(e) => setInput({...input, username: e.target.value})} 
            />
            <TextField 
              fullWidth label="Password" type={showPassword ? 'text' : 'password'} margin="normal"
              value={input.password} onChange={(e) => setInput({...input, password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              fullWidth variant="contained" type="submit" size="large"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem' }}
            >
              Masuk Aplikasi
            </Button>
          </Box>
        </Paper>
        <Typography variant="body2" color="white" align="center" sx={{ mt: 3, opacity: 0.8 }}>
          &copy; 2025 DWP Data Store. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;