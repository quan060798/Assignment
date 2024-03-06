import { Request, Response } from "express";
import Order from "../models/Order";
import { Op } from "sequelize";

interface OrderRequestBody {
  customer_name: string;
  order_date: string;
  order_status: string;
  total_amount: number;
  address: string;
}

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      customer_name,
      order_date,
      order_status,
      total_amount,
      address,
    }: OrderRequestBody = req.body;

    if (
      !customer_name ||
      !order_date ||
      !order_status ||
      !total_amount ||
      !address
    ) {
      res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
      return;
    }

    const newOrder = await Order.create({
      customerName: customer_name,
      orderDate: new Date(order_date).getTime(),
      orderStatus: order_status,
      totalAmount: parseFloat(total_amount.toFixed(2)),
      shippingInformation: address,
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.log("error--->", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customer_name,
      search_start_date,
      search_end_date,
      order_status,
      search_min_amt,
      search_max_amt,
      address,
    } = req.query;

    // Build filter conditions based on query parameters
    const filterConditions: any = {};

    if (customer_name) {
      filterConditions.customerName = { [Op.like]: `%${customer_name}%` };
    }

    if (search_start_date && search_end_date) {
        const startDate = new Date(search_start_date as string).getTime();
        const endDate = new Date(search_end_date as string).getTime();
        filterConditions.orderDate = { [Op.between]: [startDate, endDate] };
    }

    if (order_status) {
      filterConditions.orderStatus = order_status;
    }

    if (search_min_amt && search_max_amt) {
      const minAmount = parseFloat(search_min_amt as string);
      const maxAmount = parseFloat(search_max_amt as string);
      filterConditions.totalAmount = { [Op.between]: [minAmount, maxAmount] };
    }

    if (address) {
      filterConditions.shippingInformation = { [Op.like]: `%${address}%` };
    }

    const orders = await Order.findAll({
      where: filterConditions,
      order: [["orderDate", "ASC"]],
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
