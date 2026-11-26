// Shows a short message at the bottom of the screen. Use: const toast = useToast()
import { createContext, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export default function ToastHorn({ children }) {
  const [note, setNote] = useState({ open: false, text: '', type: 'success' });
  const toast = (text, type = 'success') => setNote({ open: true, text, type });
  const close = () => setNote((n) => ({ ...n, open: false }));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Snackbar open={note.open} autoHideDuration={3500} onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={note.type} variant="filled" onClose={close}>{note.text}</Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
