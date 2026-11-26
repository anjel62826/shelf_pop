// Asks for confirmation before deleting
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { errorText, removeTome } from '../api/courier';
import { useToast } from './ToastHorn';

export default function ShredDialog({ book, onClose, onDone }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      const res = await removeTome(book._id);
      toast(res.message);
      onDone();
    } catch (err) {
      toast(errorText(err), 'error');
      onClose();
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete this book?</DialogTitle>
      <DialogContent>
        <Typography>{book.title} ({book.bookCode}) will be removed. This cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Keep it</Button>
        <Button variant="contained" color="error" onClick={confirm} disabled={busy}>Delete book</Button>
      </DialogActions>
    </Dialog>
  );
}
