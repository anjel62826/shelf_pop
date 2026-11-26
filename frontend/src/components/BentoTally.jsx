// The three statistic tiles. They reload whenever refreshKey changes
import { useEffect, useState } from 'react';
import { Alert, Box, Card, Typography } from '@mui/material';
import { errorText, fetchStats } from '../api/courier';
import { SPINE } from '../utils/library';
import { INK } from '../theme';

// Decorative row of little book spines
function SpineRow() {
  const heights = [46, 62, 52, 70, 40, 58];
  return (
    <Box aria-hidden sx={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
      {Object.values(SPINE).map((colour, i) => (
        <Box key={colour} sx={{ width: 14, height: heights[i], bgcolor: colour,
          border: `2px solid ${INK}`, borderRadius: '5px 5px 0 0',
          transform: i === 4 ? 'rotate(10deg)' : 'none', transformOrigin: 'bottom left' }} />
      ))}
    </Box>
  );
}

const Figure = ({ value, label, size = '2.4rem' }) => (
  <Box>
    <Typography variant="h4" component="p" sx={{ fontSize: size, lineHeight: 1.1 }}>{value}</Typography>
    <Typography sx={{ fontWeight: 800 }}>{label}</Typography>
  </Box>
);

export default function BentoTally({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats()
      .then((res) => { setStats(res.data); setError(''); })
      .catch((err) => setError(errorText(err)));
  }, [refreshKey]);

  if (error) return <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>;
  const show = (key) => (stats ? stats[key] : '…');

  return (
    <Box component="section" aria-label="Library statistics"
      sx={{ display: 'grid', gap: 2.5, mb: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1.3fr 1fr' } }}>
      <Card sx={{ p: 2.5, bgcolor: 'primary.main', display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', gap: 2 }}>
        <Box>
          <Figure value={show('totalCopies')} label="Total copies" size="4rem" />
          <Typography sx={{ fontWeight: 800, mt: 0.5 }}>across {show('totalTitles')} titles</Typography>
        </Box>
        <SpineRow />
      </Card>
      <Card sx={{ p: 2.5, bgcolor: 'secondary.main', display: 'flex', gap: 3, alignItems: 'center' }}>
        <Figure value={show('issuedCopies')} label="Copies issued" />
        <Figure value={show('overdueLoans')} label="Overdue loans" />
      </Card>
      <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
        <Figure value={`₹${show('totalFine')}`} label="Fine collected" />
      </Card>
    </Box>
  );
}
