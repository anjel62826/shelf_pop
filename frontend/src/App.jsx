import { Navigate, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import MastheadRail from './components/MastheadRail';
import ShelfDeck from './pages/ShelfDeck';
import StockSlip from './pages/StockSlip';
import TomeFile from './pages/TomeFile';

export default function App() {
  return (
    <>
      <MastheadRail />
      {/* The side padding stops the hard shadow being cut at the screen edge */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Routes>
          <Route path="/" element={<ShelfDeck />} />
          <Route path="/add" element={<StockSlip key="add" />} />
          <Route path="/edit/:id" element={<StockSlip key="edit" />} />
          <Route path="/books/:id" element={<TomeFile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}
