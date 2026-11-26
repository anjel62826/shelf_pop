// Book list: table on wide screens, cards under 700px
import { Box, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, useMediaQuery } from '@mui/material';
import CopyPips from './CopyPips';
import TomeActions from './TomeActions';
import { SPINE } from '../utils/library';
import { INK } from '../theme';

const CodeTag = ({ book }) => (
  <Box component="span" sx={{ display: 'inline-block', px: 1, py: 0.25, whiteSpace: 'nowrap',
    fontFamily: 'monospace', fontWeight: 700, bgcolor: SPINE[book.category],
    border: `2px solid ${INK}`, borderRadius: '6px' }}>
    {book.bookCode}
  </Box>
);

const CategoryChip = ({ name }) => <Chip size="small" label={name} sx={{ bgcolor: SPINE[name] }} />;

export default function ShelfLedger({ books, onIssue, onDelete }) {
  const isNarrow = useMediaQuery('(max-width:699.95px)');

  if (isNarrow) {
    return (
      <Box sx={{ display: 'grid', gap: 2.5 }}>
        {books.map((book) => (
          <Card key={book._id} sx={{ display: 'flex' }}>
            <Box aria-hidden sx={{ width: 18, flexShrink: 0, bgcolor: SPINE[book.category],
              borderRight: `2px solid ${INK}` }} />
            <Box sx={{ p: 2, display: 'grid', gap: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <CodeTag book={book} />
                <CategoryChip name={book.category} />
              </Box>
              <Box sx={{ overflowWrap: 'anywhere' }}>
                <Typography variant="h6" component="h2">{book.title}</Typography>
                <Typography color="text.secondary">{book.author}</Typography>
              </Box>
              <CopyPips available={book.availableCopies} total={book.totalCopies} />
              <TomeActions book={book} onIssue={onIssue} onDelete={onDelete} />
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer sx={{ width: 'calc(100% - 4px)' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {['Book Code', 'Title', 'Author', 'Category', 'Copies', 'Actions'].map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book._id}>
              <TableCell><CodeTag book={book} /></TableCell>
              <TableCell sx={{ fontWeight: 800 }}>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell><CategoryChip name={book.category} /></TableCell>
              <TableCell><CopyPips available={book.availableCopies} total={book.totalCopies} /></TableCell>
              <TableCell sx={{ py: 1.5 }}>
                <TomeActions book={book} onIssue={onIssue} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
