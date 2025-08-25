require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadsRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: "https://lead-management-system-erino-ruby.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.options("*", cors());

app.use('/auth', authRoutes);
app.use('/leads', leadRoutes)

app.get('/', (req, res) => {
  res.send('Lead Management System - Erino Assignment');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
