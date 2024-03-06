import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Order extends Model {
  public id!: number;
  public orderId!: string;
  public customerName!: string;
  public orderDate!: Date;
  public orderStatus!: string;
  public totalAmount!: number;
  public shippingInformation!: string;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shippingInformation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'order',
    sequelize,
  }
);

export default Order;