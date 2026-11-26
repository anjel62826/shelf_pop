// All MUI styling overrides live in this file
import { createTheme } from '@mui/material/styles';

export const INK = '#2B2D42';
export const CREAM = '#FFF8EC';
export const TOMATO = '#EF476F';
export const MINT = '#06D6A0';

const line = `2px solid ${INK}`;
export const shadow = (size = 4) => `${size}px ${size}px 0 ${INK}`;
const sticker = { border: line, boxShadow: shadow(), borderRadius: 24 };
const press = { transform: 'translate(2px, 2px)', boxShadow: shadow(2) };
const heading = { fontFamily: "'Baloo 2', cursive", fontWeight: 800 };

const theme = createTheme({
  palette: {
    primary: { main: TOMATO, contrastText: INK },
    secondary: { main: MINT, contrastText: INK },
    success: { main: MINT, contrastText: INK },
    info: { main: INK, contrastText: '#FFFFFF' },
    warning: { main: '#FFD166', contrastText: INK },
    error: { main: '#C1121F', contrastText: '#FFFFFF' },
    background: { default: CREAM, paper: '#FFFFFF' },
    text: { primary: INK, secondary: '#55576B' },
    divider: INK,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Nunito', sans-serif",
    h4: heading,
    h5: heading,
    h6: heading,
    button: { textTransform: 'none', fontWeight: 800 },
  },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          border: line,
          borderRadius: 24,
          color: INK,
          boxShadow: shadow(),
          paddingInline: 18,
          transition: 'transform .1s, box-shadow .1s',
          '&:hover': press,
          '&.Mui-focusVisible': { outline: `3px dashed ${INK}`, outlineOffset: 3 },
          '&.Mui-disabled': { border: '2px dashed #9A9BAA', color: '#777989', boxShadow: 'none' },
        },
        containedError: { color: '#FFFFFF' },
        outlined: { backgroundColor: '#FFFFFF', '&:hover': { ...press, border: line, backgroundColor: CREAM } },
      },
    },
    MuiIconButton: { styleOverrides: { root: { color: INK } } },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: sticker } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': { border: line },
          '&.Mui-focused': { boxShadow: shadow(3) },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: line },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#C1121F' },
          '&.Mui-disabled': { backgroundColor: '#EFE9DD' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontWeight: 700, '&.Mui-focused': { color: INK } } },
    },
    MuiFormHelperText: { styleOverrides: { root: { fontWeight: 700 } } },
    MuiMenu: { styleOverrides: { paper: { border: line, boxShadow: shadow(), borderRadius: 16 } } },
    MuiChip: { styleOverrides: { root: { border: line, fontWeight: 800 } } },
    MuiSwitch: {
      styleOverrides: {
        switchBase: { '&.Mui-checked': { color: INK }, '&.Mui-checked + .MuiSwitch-track': { backgroundColor: MINT, opacity: 1 } },
        track: { border: line, boxSizing: 'border-box' },
      },
    },
    MuiDialog: { styleOverrides: { paper: { ...sticker, boxShadow: shadow(6), margin: 16 } } },
    MuiDialogTitle: { styleOverrides: { root: { ...heading, fontSize: '1.4rem' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '8px 24px 24px', gap: 8 } } },
    MuiSnackbar: { styleOverrides: { root: { '& .MuiAlert-root': { ...sticker, alignItems: 'center' } } } },
    MuiAlert: { styleOverrides: { root: { border: line, borderRadius: 16, fontWeight: 700 } } },
    MuiTableContainer: { styleOverrides: { root: { ...sticker, backgroundColor: '#FFFFFF' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `2px dashed #D5D1C6` },
        head: { ...heading, fontSize: '1rem', backgroundColor: MINT, borderBottom: line },
      },
    },
    MuiPaginationItem: {
      styleOverrides: { root: { border: line, fontWeight: 800, backgroundColor: '#FFFFFF' } },
    },
    MuiCircularProgress: { styleOverrides: { root: { color: TOMATO } } },
    MuiLink: { styleOverrides: { root: { color: INK, fontWeight: 800 } } },
  },
});

export default theme;
