// Issue, History, Edit and Delete buttons for one book
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const small = { size: 'small', sx: { boxShadow: '3px 3px 0 #2B2D42', px: 1.5, minWidth: 0 } };

export default function TomeActions({ book, onIssue, onDelete }) {
  const hasLoans = book.availableCopies < book.totalCopies;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
      <Button {...small} variant="contained" disabled={book.availableCopies === 0}
        onClick={() => onIssue(book)}>Issue</Button>
      <Button {...small} variant="contained" color="secondary" component={Link}
        to={`/books/${book._id}`}>Loans</Button>
      <Button {...small} variant="outlined" component={Link} to={`/edit/${book._id}`}>Edit</Button>
      <Box component="span" title={hasLoans ? 'Return all copies before deleting' : ''}>
        <Button {...small} variant="outlined" disabled={hasLoans} onClick={() => onDelete(book)}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}
