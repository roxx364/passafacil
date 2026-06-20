
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ContratoPage from './pages/ContratoPage';
import SuccessPage from './pages/SuccessPage';
import PIXPaymentPage from './pages/PIXPaymentPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contratar" element={<ContratoPage />} />
        <Route path="/pagamento-pix" element={<PIXPaymentPage />} />
        <Route path="/sucesso" element={<SuccessPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
