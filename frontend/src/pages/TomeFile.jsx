// Book details page with loan history
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, Chip, CircularProgress, Typography } from '@mui/material';
import BentoTally from '../components/BentoTally';
import CopyPips from '../components/CopyPips';
import LoanStamps from '../components/LoanStamps';
import IssueSlipDialog from '../components/IssueSlipDialog';
import { useToast } from '../components/ToastHorn';
import { errorText, fetchLoans, fetchTome, returnLoan } from '../api/courier';
import { SPINE } from '../utils/library';

export default function TomeFile() {
  const { id } = useParams();
  const toast = useToast();
  const [book, setBook] = useState(null);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    try {
      const [bookRes, loanRes] = await Promise.all([fetchTome(id), fetchLoans(id)]);
      setBook(bookRes.data);
      setLoans(loanRes.data);
      setError('');
    } catch (err) {
      setError(errorText(err));
    }
  }, [id]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const refresh = () => {
    setIssuing(false);
    setRefreshKey((k) => k + 1);
  };

  const handleReturn = async (loan) => {
    setBusyId(loan._id);
    try {
      const res = await returnLoan(loan._id);
      toast(res.message);
    } catch (err) {
      toast(errorText(err), 'error');
    }
    setBusyId('');
    refresh();
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!book) return <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>;

  return (
    <>
      <BentoTally refreshKey={refreshKey} />
      <Card sx={{ p: 3, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Box sx={{ mr: 'auto', overflowWrap: 'anywhere' }}>
          <Chip label={`${book.bookCode} · ${book.category}`} sx={{ bgcolor: SPINE[book.category], mb: 1 }} />
          <Typography variant="h4" component="h1">{book.title}</Typography>
          <Typography>{book.author} · ISBN {book.isbn}</Typography>
        </Box>
        <CopyPips available={book.availableCopies} total={book.totalCopies} />
        <Button variant="contained" disabled={book.availableCopies === 0} onClick={() => setIssuing(true)}>
          Issue
        </Button>
        <Button component={Link} to="/" variant="outlined">Back</Button>
      </Card>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Loan History</Typography>
      {loans.length === 0
        ? <Card sx={{ p: 3 }}><Typography>No loans yet. Use Issue to lend this book.</Typography></Card>
        : <LoanStamps loans={loans} onReturn={handleReturn} busyId={busyId} />}

      {issuing && <IssueSlipDialog book={book} onClose={() => setIssuing(false)} onDone={refresh} />}
    </>
  );
}
