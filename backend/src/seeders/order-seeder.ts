import Order from '../models/Order';
import { faker } from '@faker-js/faker';

const insertFakeOrders = async (numOrders: number) => {
  try {
    await Order.sync();
    for (let i = 0; i < numOrders; i++) {
      await Order.create({
        customerName: faker.internet.userName(),
        orderDate: faker.date.recent({ days: 30 }).getTime(),
        orderStatus: faker.helpers.arrayElement(['Shipped', 'Processing', 'Cancelled']),
        totalAmount: faker.number.float({ min: 10, max: 500, precision: 0.01 }),
        shippingInformation: faker.location.streetAddress(),
      });
    }
  } catch (error) {
  }
};

// Set the number of fake orders you want to generate
const numberOfFakeOrders = 30;
insertFakeOrders(numberOfFakeOrders);