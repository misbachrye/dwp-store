import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center" }}>
          <ErrorOutlineIcon
            sx={{ fontSize: 100, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h1" fontWeight="bold" color="primary">
            404
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: "text.secondary" }}>
            Halaman yang Anda cari tidak ditemukan.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Kembali ke Halaman Awal
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
