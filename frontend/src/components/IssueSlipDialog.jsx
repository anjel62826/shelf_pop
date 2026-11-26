// Popup form to issue a book
import { useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { errorText, issueTome } from '../api/courier';
import { addDaysKey, showDate, todayKey } from '../utils/library';
import { useToast } from './ToastHorn';

export default function IssueSlipDialog({ book, onClose, onDone }) {
  const toast = useToast();
  const [form, setForm] = useState({ memberName: '', memberId: '', issueDate: todayKey() });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const validate = () => {
    const found = {};
    if (!form.memberName.trim()) found.memberName = 'Member Name is required';
    if (!form.memberId.trim()) found.memberId = 'Member ID is required';
    if (!form.issueDate) found.issueDate = 'Issue Date is required';
    else if (form.issueDate > todayKey()) found.issueDate = 'Issue Date cannot be in the future';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await issueTome(book._id, form);
      toast(res.message);
      onDone();
    } catch (err) {
      setServerError(errorText(err));
      setBusy(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <TextField label={label} value={form[name]} error={!!errors[name]} helperText={errors[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })} {...extra} />
  );

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={submit} noValidate>
        <DialogTitle>Issue: {book.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1, pr: 0.5 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            {field('memberName', 'Member Name', { autoFocus: true })}
            {field('memberId', 'Member ID')}
            {field('issueDate', 'Issue Date', { type: 'date',
              slotProps: { inputLabel: { shrink: true }, htmlInput: { max: todayKey() } } })}
            {form.issueDate && (
              <Alert severity="success" icon={false}>
                Due back on {showDate(addDaysKey(form.issueDate, 14))}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={busy}>Issue book</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
