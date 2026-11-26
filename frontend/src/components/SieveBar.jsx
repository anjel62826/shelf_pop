// Category chips, search box, sort menu and "Available only" switch
import { Box, Chip, FormControlLabel, InputAdornment, MenuItem, Switch, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CATEGORIES, SPINE } from '../utils/library';
import { INK, shadow } from '../theme';

export default function SieveBar({ query, onChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
        {['', ...CATEGORIES].map((name) => {
          const active = query.category === name;
          const colour = SPINE[name] || '#FFFFFF';
          return (
            <Chip key={name || 'all'} label={name || 'All'} onClick={() => onChange({ category: name })}
              aria-pressed={active}
              sx={{ bgcolor: active ? colour : '#fff', boxShadow: active ? shadow(3) : 'none',
                '&:hover': { bgcolor: colour },
                '&::before': { content: '""', width: 10, height: 10, ml: 1, borderRadius: '50%',
                  bgcolor: colour, border: `2px solid ${INK}` } }} />
          );
        })}
      </Box>
      <Box sx={{ display: 'grid', gap: 2, alignItems: 'center',
        gridTemplateColumns: { xs: '1fr', md: '1fr 220px auto' } }}>
        <TextField size="small" label="Search by title or author" value={query.search}
          onChange={(e) => onChange({ search: e.target.value })}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
        <TextField size="small" select label="Sort by" value={query.sort}
          onChange={(e) => onChange({ sort: e.target.value })}>
          <MenuItem value="newest">Newest first</MenuItem>
          <MenuItem value="title">Title A to Z</MenuItem>
          <MenuItem value="author">Author A to Z</MenuItem>
          <MenuItem value="available">Most available</MenuItem>
        </TextField>
        <FormControlLabel label="Available only"
          control={<Switch checked={query.available} onChange={(e) => onChange({ available: e.target.checked })} />} />
      </Box>
    </Box>
  );
}
