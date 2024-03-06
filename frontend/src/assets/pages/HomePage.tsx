import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useRecoilState } from "recoil";
import orderAtom from "../atoms/orderAtom";
import { toast } from "react-toastify";
import OrderBarChart from "../components/OrderBarChart";
import Modal from "react-modal";
import OrderPieChart from "../components/OrderPieChart";
import OrderLineChart from "../components/OrderLineChart";

const HomePage = () => {
  Modal.setAppElement(document.getElementById("root"));
  const [order, setOrder] = useRecoilState(orderAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChartType, setModalChartType] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(order);

  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortData = (column: string) => {
    setDisplayOrder(prevDisplayOrder => {
      const arr = prevDisplayOrder.length > 0 ? [...prevDisplayOrder] : [...order];
      const sortedData = [...arr].sort((a: any, b: any) => {
        if (sortOrder === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
  
      setSortColumn(column);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  
      return sortedData;
    });
  };

  useEffect(() => {
    console.log('order--->', order);
    setDisplayOrder(order);
    sortData('id');
  }, [order])
  
 
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await fetch("/api/order/get", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (res.status === 304) {
          return;
        }

        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          return;
        }

        setOrder(data.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    getOrder();
  }, [setOrder]);

  const parseDate = (inputDate: Date): string => {
    const parsedDate = new Date(inputDate);
    const formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')} ${String(parsedDate.getHours()).padStart(2, '0')}:${String(parsedDate.getMinutes()).padStart(2, '0')}:${String(parsedDate.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
  }

  return (
    <>
      <Layout>
        {order && order.length > 0 ? (
          <>
            <div className="flex p-5 gap-4">
              <div
                className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center min-h-80 justify-center cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalChartType(1);
                }}
              >
                {order && order.length > 0 && <OrderBarChart data={order} />}
              </div>

              <div
                className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center min-h-80 justify-center cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalChartType(2);
                }}
              >
                {order && order.length > 0 && (
                  <OrderPieChart data={order} chartOptionApply={false} />
                )}
              </div>
              <div
                className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center min-h-80 justify-center cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalChartType(3);
                }}
              >
                {order && order.length > 0 && <OrderLineChart data={order} />}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px] pb-10">
              <table className="w-full border-collapse">
                <thead
                  className={isModalOpen ? "" : "sticky top-0 bg-gray-200 z-10"}
                >
                  <tr className="bg-gray-200">
                    <th
                      className="py-2 px-4 text-left cursor-pointer"
                      onClick={() => sortData('id')}
                    >
                      ID {sortColumn === 'id' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                      </th>
                    <th
                      className="py-2 px-4 text-left cursor-pointer"
                      onClick={() => sortData('customerName')}
                    >
                      Customer Name {sortColumn === 'customerName' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                    </th>
                    <th
                      className="py-2 px-4 text-left cursor-pointer"
                      onClick={() => sortData('orderDate')}
                    >
                      Order Date {sortColumn === 'orderDate' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                    </th>
                    <th
                      className="py-2 px-4 text-left cursor-pointer"
                      onClick={() => sortData('orderStatus')}
                    >
                      Order Status {sortColumn === 'orderStatus' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                    </th>
                    <th
                      className="py-2 px-4 text-left cursor-pointer"
                      onClick={() => sortData('totalAmount')}
                    >
                      Total Amount {sortColumn === 'totalAmount' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                    </th>
                    <th
                      className="py-2 px-4 text-left cursor-pointer"
                      onClick={() => sortData('shippingInformation')}
                    >
                      Shipping Information {sortColumn === 'shippingInformation' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrder.map((or) => (
                    <tr key={or.id} className="border-b">
                      <td className="py-2 px-4">{or.id}</td>
                      <td className="py-2 px-4">{or.customerName}</td>
                      <td className="py-2 px-4">{parseDate(or.orderDate)}</td>
                      <td className="py-2 px-4">{or.orderStatus}</td>
                      <td className="py-2 px-4">{or.totalAmount}</td>
                      <td className="py-2 px-4">{or.shippingInformation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              className="modal"
              overlayClassName="overlay"
            >
              <div className="bg-white rounded-sm p-4 border border-gray-200 relative min-w-[1200px] min-h-[600px]">
                {" "}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="close-button"
                >
                  &#x2715;{" "}
                </button>
                {modalChartType === 1 && (
                  <>
                    <h2>Bar Chart {"(Total Amount Per Date)"}</h2>
                    {order && order.length > 0 && (
                      <OrderBarChart data={order} />
                    )}
                  </>
                )}
                {modalChartType === 2 && (
                  <>
                    <h2>Doughnut Chart {"(Total Order Per Status)"}</h2>
                    {order && order.length > 0 && (
                      <OrderPieChart data={order} chartOptionApply={true} />
                    )}
                  </>
                )}
                {modalChartType === 3 && (
                  <>
                    <h2>Line Chart {"(Total Order Per Date)"}</h2>
                    {order && order.length > 0 && (
                      <OrderLineChart data={order} />
                    )}
                  </>
                )}
              </div>
            </Modal>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800">Loading... or No Data</h1>
          </>
        )}
      </Layout>
    </>
  );
};

export default HomePage;
