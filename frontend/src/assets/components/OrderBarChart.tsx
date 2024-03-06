import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Order } from "../../model/order.model";
import { CategoryScale, TimeScale } from "chart.js/auto";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, TimeScale);

interface OrderChartProps {
  data: Order[];
}

const OrderBarChart = (props: OrderChartProps) => {
  const { data } = props;

  const [totalAmountsByDate, setTotalAmountsByDate] = useState<
    { date: string; totalAmount: number }[]
  >([]);

  useEffect(() => {
    const newTotalAmountsByDate: { date: string; totalAmount: number }[] = [];

    data.forEach((order) => {
      const orderDate = new Date(order.orderDate).toLocaleDateString();
      const existingEntryIndex = newTotalAmountsByDate.findIndex(
        (entry) => entry.date === orderDate
      );

      if (existingEntryIndex === -1) {
        newTotalAmountsByDate.push({
          date: orderDate,
          totalAmount: order.totalAmount,
        });
      } else {
        newTotalAmountsByDate[existingEntryIndex].totalAmount +=
          order.totalAmount;
      }
    });

    setTotalAmountsByDate(newTotalAmountsByDate);
  }, [data]);

  const dates = totalAmountsByDate.map((entry) => entry.date);
  const totalAmounts = data.map((entry) => entry.totalAmount);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Total Amount",
        data: totalAmounts,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OrderBarChart;
