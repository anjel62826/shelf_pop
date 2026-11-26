// Loan history shown like cards from a library date-stamp slip
import { Box, Button, Card, Typography } from '@mui/material';
import { showDate } from '../utils/library';
import { INK, MINT } from '../theme';

function Stamp({ text, bg, color = INK }) {
  return (
    <Box component="span" sx={{ px: 1.5, py: 0.25, bgcolor: bg, color, fontWeight: 800,
      border: `2px solid ${INK}`, borderRadius: '8px', transform: 'rotate(-4deg)', display: 'inline-block' }}>
      {text}
    </Box>
  );
}

const Detail = ({ label, value }) => (
  <Box>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
  </Box>
);

export default function LoanStamps({ loans, onReturn, busyId }) {
  return (
    <Box sx={{ display: 'grid', gap: 2.5 }}>
      {loans.map((loan) => {
        const issued = loan.status === 'Issued';
        return (
          <Card key={loan._id} sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
              <Box sx={{ mr: 'auto', overflowWrap: 'anywhere' }}>
                <Typography variant="h6" component="h3">{loan.memberName}</Typography>
                <Typography color="text.secondary">Member ID: {loan.memberId}</Typography>
              </Box>
              <Stamp text={loan.status} bg={issued ? '#FFD166' : MINT} />
              {loan.isOverdue && <Stamp text="Overdue" bg="#C1121F" color="#fff" />}
              {issued && (
                <Button variant="contained" disabled={busyId === loan._id} onClick={() => onReturn(loan)}>
                  Return
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'grid', gap: 1.5, borderTop: '2px dashed #D5D1C6', pt: 1.5,
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' } }}>
              <Detail label="Issue Date" value={showDate(loan.issueDate)} />
              <Detail label="Due Date" value={showDate(loan.dueDate)} />
              <Detail label="Return Date" value={showDate(loan.returnDate)} />
              <Detail label="Fine" value={`₹${loan.fine}`} />
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}
