import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoute';
import orderRoute from './src/routes/orderRoute';
import { sequelize } from './src/config/database';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/order', orderRoute);

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Error syncing Sequelize:', error));
