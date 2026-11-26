// Dashboard page: stats, filters, book list and pagination
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Box, Button, Card, CircularProgress, Pagination, Typography } from '@mui/material';
import BentoTally from '../components/BentoTally';
import SieveBar from '../components/SieveBar';
import ShelfLedger from '../components/ShelfLedger';
import IssueSlipDialog from '../components/IssueSlipDialog';
import ShredDialog from '../components/ShredDialog';
import { errorText, fetchTomes } from '../api/courier';

const START = { search: '', category: '', available: false, sort: 'newest', page: 1 };

export default function ShelfDeck() {
  const [query, setQuery] = useState(START);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [issuing, setIssuing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Any filter change goes back to page 1
  const changeQuery = (patch) => setQuery((q) => ({ ...q, page: 1, ...patch }));

  // Reload the list and the stats
  const refresh = () => {
    setIssuing(null);
    setDeleting(null);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    let ignore = false; // ignores an older reply that arrives late
    // Wait a moment so we do not call the server on every key press
    const timer = setTimeout(async () => {
      try {
        const res = await fetchTomes(query);
        if (ignore) return;
        // If the last book on a page was removed, step back one page
        if (query.page > res.data.totalPages) {
          setQuery((q) => ({ ...q, page: res.data.totalPages }));
          return;
        }
        setResult(res.data);
        setError('');
      } catch (err) {
        if (!ignore) setError(errorText(err));
      }
    }, 300);
    return () => { ignore = true; clearTimeout(timer); };
  }, [query, refreshKey]);

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>Today at the shelf</Typography>
      <BentoTally refreshKey={refreshKey} />
      <SieveBar query={query} onChange={changeQuery} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!result && !error && <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>}

      {result && result.books.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No books found</Typography>
          <Typography sx={{ mb: 2 }}>Change the filters, or add a book.</Typography>
          <Button component={Link} to="/add" variant="contained">Add Book</Button>
        </Card>
      )}

      {result && result.books.length > 0 && (
        <>
          <ShelfLedger books={result.books} onIssue={setIssuing} onDelete={setDeleting} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 3 }}>
            <Pagination count={result.totalPages} page={result.page} color="primary"
              onChange={(e, page) => setQuery((q) => ({ ...q, page }))} />
            <Typography variant="body2">
              Page {result.page} of {result.totalPages} · {result.totalBooks} books
            </Typography>
          </Box>
        </>
      )}

      {issuing && <IssueSlipDialog book={issuing} onClose={() => setIssuing(null)} onDone={refresh} />}
      {deleting && <ShredDialog book={deleting} onClose={() => setDeleting(null)} onDone={refresh} />}
    </>
  );
}
