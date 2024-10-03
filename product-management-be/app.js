const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
