import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import TransactionHistory from "./pages/TransactionHistory";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [retryInfo, setRetryInfo] = useState({ open: false, message: "" });

  useEffect(() => {
    const handleRetry = (e) => {
      const { count, max } = e.detail;
      setRetryInfo({
        open: true,
        message: `Server sedang mencoba menghubungkan... (${count}/${max})`,
      });
    };

    window.addEventListener("axios-retry", handleRetry);

    return () => {
      window.removeEventListener("axios-retry", handleRetry);
    };
  }, []);

  const handleCloseRetry = () => {
    setRetryInfo({ ...retryInfo, open: false });
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<CustomerPage />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Notifikasi Global untuk Retry */}
        <Snackbar
          open={retryInfo.open}
          autoHideDuration={4000}
          onClose={handleCloseRetry}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
            {retryInfo.message}
          </Alert>
        </Snackbar>
      </Router>
    </AuthProvider>
  );
}

export default App;
