// Shows Available/Total with one small block per copy. Red when none are available
import { Box, Typography } from '@mui/material';
import { INK, MINT } from '../theme';

export default function CopyPips({ available, total }) {
  const empty = available === 0;
  return (
    <Box>
      <Typography sx={{ fontWeight: 800, color: empty ? 'error.main' : 'text.primary', whiteSpace: 'nowrap' }}>
        {available}/{total} available
      </Typography>
      <Box aria-hidden sx={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: 130 }}>
        {Array.from({ length: total }, (_, i) => (
          <Box key={i} sx={{ width: 9, height: 13, borderRadius: '3px',
            border: `1.5px solid ${empty ? '#C1121F' : INK}`, bgcolor: i < available ? MINT : '#fff' }} />
        ))}
      </Box>
    </Box>
  );
}
