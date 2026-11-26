// One form used for both Add Book and Edit Book
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { addTome, editTome, errorText, fetchTome } from '../api/courier';
import { useToast } from '../components/ToastHorn';
import { CATEGORIES, SPINE } from '../utils/library';
import { INK } from '../theme';

const BLANK = { title: '', author: '', isbn: '', category: '', totalCopies: '' };

export default function StockSlip() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);

  // Fill the form with the saved book when editing
  useEffect(() => {
    if (!isEdit) return;
    fetchTome(id)
      .then((res) => setForm({ ...res.data, totalCopies: String(res.data.totalCopies) }))
      .catch((err) => setLoadError(errorText(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const found = {};
    const copies = Number(form.totalCopies);
    if (!form.title.trim()) found.title = 'Title is required';
    if (!form.author.trim()) found.author = 'Author is required';
    if (!/^(\d{10}|\d{13})$/.test(form.isbn.trim())) found.isbn = 'ISBN must be exactly 10 or 13 digits';
    if (!form.category) found.category = 'Choose a category';
    if (!Number.isInteger(copies) || copies < 1 || copies > 20) {
      found.totalCopies = 'Enter a whole number from 1 to 20';
    }
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setBusy(true);
    const { title, author, isbn, category } = form;
    const totalCopies = Number(form.totalCopies);
    try {
      const res = isEdit
        ? await editTome(id, { title, author, totalCopies })
        : await addTome({ title, author, isbn: isbn.trim(), category, totalCopies });
      toast(res.message);
      navigate('/');
    } catch (err) {
      // Includes the 409 duplicate ISBN message
      setServerError(errorText(err));
      if (err.response?.status === 409) setErrors({ isbn: errorText(err) });
      setBusy(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <TextField label={label} value={form[name]} error={!!errors[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      {...extra} helperText={errors[name] || extra.helperText} />
  );

  if (loading) return <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>;
  if (loadError) return <Alert severity="error">{loadError}</Alert>;

  return (
    <Box sx={{ display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
      <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>{isEdit ? 'Edit Book' : 'Add Book'}</Typography>
        <Box component="form" onSubmit={submit} noValidate sx={{ display: 'grid', gap: 2 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {isEdit && <TextField label="Book Code" value={form.bookCode || ''} disabled />}
          {field('title', 'Title')}
          {field('author', 'Author')}
          {field('isbn', 'ISBN', { disabled: isEdit, helperText: '10 or 13 digits, no dashes',
            slotProps: { htmlInput: { inputMode: 'numeric', maxLength: 13 } } })}
          {field('category', 'Category', { select: true, disabled: isEdit,
            children: CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>) })}
          {field('totalCopies', 'Total Copies', { type: 'number', helperText: 'From 1 to 20',
            slotProps: { htmlInput: { min: 1, max: 20 } } })}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button component={Link} to="/" variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={busy}>
              {isEdit ? 'Save changes' : 'Add book'}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Live preview of the book cover */}
      <Card aria-hidden sx={{ display: 'flex', minHeight: 300, width: '100%', maxWidth: 260, justifySelf: 'center',
        bgcolor: SPINE[form.category] || '#fff' }}>
        <Box sx={{ width: 28, borderRight: `2px solid ${INK}`, bgcolor: 'rgba(255,255,255,0.5)' }} />
        <Box sx={{ p: 2.5, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', overflowWrap: 'anywhere' }}>
          <Typography variant="h5" component="p">{form.title || 'Your book title'}</Typography>
          <Box>
            <Typography sx={{ fontWeight: 800 }}>{form.author || 'Author name'}</Typography>
            <Typography variant="body2">{form.category || 'Category'}</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
