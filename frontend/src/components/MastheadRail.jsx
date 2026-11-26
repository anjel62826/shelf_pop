// Top navigation bar
import { NavLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { INK, MINT } from '../theme';

const TABS = [
  { to: '/', label: 'Dashboard' },
  { to: '/add', label: 'Add Book' },
];

export default function MastheadRail() {
  return (
    <Box component="header" sx={{ bgcolor: '#fff', borderBottom: `2px solid ${INK}` }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 1.5, display: 'flex',
        flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'grid', placeItems: 'center', width: 42, height: 42, bgcolor: 'primary.main',
            border: `2px solid ${INK}`, borderRadius: '14px', transform: 'rotate(-6deg)' }}>
            <AutoStoriesIcon />
          </Box>
          <Typography variant="h5" component="span">ShelfPop</Typography>
        </Box>
        <Box component="nav" sx={{ display: 'flex', gap: 1.5 }}>
          {TABS.map((tab) => (
            <Button key={tab.to} component={NavLink} to={tab.to} end variant="outlined"
              sx={{ '&.active, &.active:hover': { bgcolor: MINT } }}>
              {tab.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
