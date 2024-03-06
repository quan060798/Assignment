import { useEffect, useState } from "react";
import { Order } from "../../model/order.model";
import { Doughnut } from "react-chartjs-2";

interface OrderChartProps {
  data: Order[];
  chartOptionApply: boolean;
}

const OrderPieChart = (props: OrderChartProps) => {
  const { data, chartOptionApply } = props;
  const [totalOrderByStatus, setTotalOrderByStatus] = useState<
    { orderStatus: string; totalNumber: number }[]
  >([]);

  useEffect(() => {
    const newTotalOrderByStatus: {
      orderStatus: string;
      totalNumber: number;
    }[] = [];
    data.forEach((order) => {
      const { orderStatus } = order;
      const existingEntryIndex = newTotalOrderByStatus.findIndex(
        (entry) => entry.orderStatus === orderStatus
      );
      if (existingEntryIndex === -1) {
        newTotalOrderByStatus.push({
          orderStatus: orderStatus,
          totalNumber: 1,
        });
      } else {
        newTotalOrderByStatus[existingEntryIndex].totalNumber += 1;
      }
    });

    setTotalOrderByStatus(newTotalOrderByStatus);
  }, [data]);

  const labels = totalOrderByStatus.map((item) => item.orderStatus);
  const values = totalOrderByStatus.map((item) => item.totalNumber);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 50,
    legend: {
      display: true,
      position: "top",
    },
  };
  return (
    <div className="max-h-[600px] overflow-hidden">
      <Doughnut
        data={chartData}
        options={chartOptionApply ? chartOptions : undefined}
      />
      ;
    </div>
  );
};

export default OrderPieChart;
