import { useEffect, useState } from "react";
import { Order } from "../../model/order.model";
import { Line } from "react-chartjs-2";

interface OrderChartProps {
  data: Order[];
}

const OrderLineChart = (props: OrderChartProps) => {
  const { data } = props;
  const [totalOrdersByDate, setTotalOrdersByDate] = useState<
    { date: string; totalOrder: number }[]
  >([]);

  useEffect(() => {
    const newTotalOrdersByDate: { date: string; totalOrder: number }[] = [];

    data.forEach((order) => {
      const orderDate = new Date(order.orderDate).toLocaleDateString();
      const existingEntryIndex = newTotalOrdersByDate.findIndex(
        (entry) => entry.date === orderDate
      );

      if (existingEntryIndex === -1) {
        newTotalOrdersByDate.push({ date: orderDate, totalOrder: 1 });
      } else {
        newTotalOrdersByDate[existingEntryIndex].totalOrder += 1;
      }
    });

    setTotalOrdersByDate(newTotalOrdersByDate);
  }, [data]);

  const labels = totalOrdersByDate.map((entry) => entry.date);
  const totalOrders = totalOrdersByDate.map((entry) => entry.totalOrder);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Orders",
        data: totalOrders,
        fill: false,
        borderColor: "#0074D9", // Customize the line color
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default OrderLineChart;
