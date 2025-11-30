import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Chip, Tooltip } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';

// Import Icons
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogout, setOpenLogout] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const getButtonStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      borderBottom: isActive ? '3px solid #fff' : '3px solid transparent',
      borderRadius: 0,
      opacity: isActive ? 1 : 0.7,
      transition: 'all 0.3s',
      fontWeight: isActive ? 'bold' : 'normal',
      '&:hover': {
        opacity: 1,
        backgroundColor: 'rgba(255,255,255,0.1)'
      }
    };
  };

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1565C0, #42A5F5)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            
            {/* 1. BRAND / LOGO */}
            <StorefrontIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              onClick={() => navigate('/')}
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                flexGrow: 1
              }}
            >
              DWP STORE
            </Typography>

            {/* 2. MENU NAVIGATION */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/')}
                sx={getButtonStyle('/')}
              >
                Customers
              </Button>
              <Button
                color="inherit"
                startIcon={<ReceiptLongIcon />}
                onClick={() => navigate('/transactions')}
                sx={getButtonStyle('/transactions')}
              >
                Riwayat
              </Button>
            </Box>

            {/* 3. USER PROFILE & LOGOUT */}
            <Box sx={{ flexGrow: 0, ml: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
               <Chip
                  icon={<AccountCircleIcon style={{ color: 'white' }}/>}
                  label={user?.username || 'Admin'}
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    display: { xs: 'none', sm: 'flex' } 
                  }}
               />
               
               <Tooltip title="Keluar Aplikasi">
                 <Button
                   color="inherit"
                   onClick={() => setOpenLogout(true)}
                   sx={{ 
                     minWidth: 'auto', 
                     p: 1, 
                     borderRadius: '50%',
                     '&:hover': { bgcolor: 'rgba(255,0,0,0.2)' } 
                   }}
                 >
                   <LogoutIcon />
                 </Button>
               </Tooltip>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>

      {/* Dialog Konfirmasi Logout */}
      <ConfirmDialog
        open={openLogout}
        title="Konfirmasi Logout"
        content="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmText="Keluar"
        danger={true}
        onCancel={() => setOpenLogout(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Layout;