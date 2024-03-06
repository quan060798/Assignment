export interface Order {
  id: number;
  customerName: string;
  orderDate: Date;
  orderStatus: string;
  totalAmount: number;
  shippingInformation: string;
}
