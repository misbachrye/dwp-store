import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CustomerPage from './pages/CustomerPage';
import TransactionHistory from './pages/TransactionHistory';
import Layout from './components/Layout';

// Komponen untuk memproteksi route (Harus Login)
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<CustomerPage />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;