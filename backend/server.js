require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectAtlas = require('./config/atlas');
const tomeRoutes = require('./routes/tomeRoutes');
const lendingRoutes = require('./routes/lendingRoutes');
const { getStats } = require('./controllers/statsController');
const { reply, notFound, errorHandler } = require('./utils/reply');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => reply(res, 200, 'ShelfPop API is running'));
app.use('/api/books', tomeRoutes);
app.use('/api/loans', lendingRoutes);
app.get('/api/stats', getStats);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start listening only after the database is connected
connectAtlas().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
